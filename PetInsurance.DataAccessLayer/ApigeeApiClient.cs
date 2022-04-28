using Newtonsoft.Json;
using PetInsurance.Common;
using PetInsurance.Common.Logging;
using SX.API.Common.HttpClient;
using SX.API.Common.HttpClient.Models;
using SX.API.Common.Shared.Models.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace PetInsurance.DataAccessLayer
{
    public class ApigeeApiClient
    {
        private readonly ApiServicesClient _client;
        private readonly AppInsightsLoggerService<ApigeeApiClient> _logger = new AppInsightsLoggerService<ApigeeApiClient>();
        private readonly string _baseUrl;
        private readonly string _sourceSystem;

        public ApigeeApiClient()
        {
            _baseUrl = ConfigurationHelper.GetValue("PetQnB_ApiBasePath");
            _sourceSystem = ConfigurationHelper.GetValue("PetQnB_SourceSystem");

            var config = new ApiClientConfiguration
            {
                AuthenticationAddress = ConfigurationHelper.GetValue("PetQnB_ApiClientAuthenticationAddress"),
                ClientId = ConfigurationHelper.GetValue("PetQnB_ApiClientAuthenticationId"),
                ClientSecret = ConfigurationHelper.GetValue("PetQnB_ApiClientAuthenticationSecret"),
                PolicyTimeoutExecution = ConfigurationHelper.GetValue("PetQnB_ApiClientPolicyTimeoutExecution", 20),
                PolicyTimeoutOverall = ConfigurationHelper.GetValue("PetQnB_ApiClientPolicyTimeoutOverall", 20),
                PolicyRetries = ConfigurationHelper.GetValue("PetQnB_ApiClientPolicyRetries", 0)
            };

            var certProvider = new CertificateProviderService();
            X509Certificate2 certificate = certProvider.GetCertificate();

            if (certificate == null)
            {
                // We are going to intentionally throw here knowing it will be unhandled.
                // We want to catch this as early and loud as possible so it's clear there is a problem with the certificate.
                var e = new ApplicationException($"Unable to load certificate");

                _logger.Error(e,
                    "Unable to load certificate. Check CertificateThumbprint, cert store and permissions.");

                throw e;
            }

            var handler = new HttpClientHandler
            {
                UseDefaultCredentials = true,
                ClientCertificates = { certificate }
            };

            var queue = new ApiServicesAuthenticationQueue(config,
                new AppInsightsLoggerService<ApiServicesAuthenticationQueue>(), handler: handler);

            _client = new ApiServicesClient(config, new AppInsightsLoggerService<ApiServicesClient>(), queue,
                handler: handler);
        }

        public async Task<ApiResponse<TResult>> Execute<TResult>(HttpMethod method, string path, object requestBody = null,
            IEnumerable<KeyValuePair<string, string>> queryParameters = null, Guid? transactionId = null)
        {
            var tranId = transactionId ?? Guid.NewGuid();
            string query = queryParameters?.Aggregate("?", (acc, q) => $"{acc}&{q.Key}={Uri.EscapeDataString(q.Value)}");
            string url = $"{_baseUrl}/{path}{query}";

            _logger.Info($"{tranId} - {method} {path}", requestBody);

            SingleServiceResult<HttpResponseMessage> result = await _client.ExecuteExpectingResponse(() => new HttpRequestMessage
            {
                Headers =
                {
                    {"SourceSystem", _sourceSystem},
                    {"TransactionId", tranId.ToString()}
                },
                Method = method,
                RequestUri = new Uri(url),
                Content =
                    requestBody != null
                        ? new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json")
                        : null
            });

            if (result.Success)
            {
                string stringResponse = await result.Item.Content.ReadAsStringAsync();
                
                _logger.Info($"{tranId} - Response", stringResponse);

                // only deserialize json response, else return string as a message
                if (result.Item.Content.Headers.ContentType.MediaType != "application/json")
                {
                    return new ApiResponse<TResult>
                    {
                        Success = true,
                        Message = stringResponse
                    };
                }

                TResult item = JsonConvert.DeserializeObject<TResult>(stringResponse);
                return new ApiResponse<TResult>
                {
                    Success = true,
                    Item = item,
                };
            }

            string content = null;

            if (result.Item?.Content != null)
            {
                content = await result.Item?.Content.ReadAsStringAsync();
            }

            _logger.Warn($"{tranId} - Response", content);
            _logger.Error("Request failed with the following data", content);

            return new ApiResponse<TResult>
            {
                StatusCode = result.Item?.StatusCode ?? 0, // If no status code returned it never reached the target
                Success = false,
                Message = content ?? "Unexpected error"
            };
        }
    }
}
