using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using PetInsurance.Common;
using PetInsurance.Common.Logging;
using PetInsurance.Entities;
using System;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PetInsurance.DataAccessLayer
{
    public class LeadServiceHttpClient
    {
        private static readonly HttpClient _httpClient = new HttpClient()
        {
            Timeout = TimeSpan.FromMinutes(5)
        };

        private static readonly Regex RxMsAjaxJsonInner =
            new Regex("^{\\s*\"d\"\\s*:(.*)}$", RegexOptions.Compiled);

        private static readonly Regex RxMsAjaxJsonInnerType =
            new Regex("\\s*\"__type\"\\s*:\\s*\"[^\"]*\"\\s*,\\s*", RegexOptions.Compiled);

        private readonly string _customerLeadServiceUrl;
        private readonly string _subscriptionKey;
        private readonly Guid _correlationId = Guid.NewGuid();
        private readonly AppInsightsLoggerService<LeadServiceHttpClient> _logger;

        public LeadServiceHttpClient()
        {
            _logger = new AppInsightsLoggerService<LeadServiceHttpClient>();
            _customerLeadServiceUrl = ConfigurationHelper.GetValue("PetQnB_CustomerLeadServiceUrl");
            _subscriptionKey = ConfigurationHelper.GetValue("PetQnB_Ocp-Apim-Subscription-Key");
        }

        private void SetupHeaders(HttpContent content)
        {
            content.Headers.Add("X-Organisation-Correlation-Id", _correlationId.ToString());
            content.Headers.Add("Ocp-Apim-Subscription-Key", _subscriptionKey);
        }

        public async Task<CustomerLeadResponse> CreateCustomerLeadAsync(CustomerLeadRequest lead)
        {
            // TODO: Need to review the route parameter
            return await ExecuteRequest(HttpMethod.Post, "claims", lead);
        }

        public async Task<CustomerLeadResponse> UpdateCustomerLeadAsync(CustomerLeadRequest lead)
        {
            // TODO: Need to review the route parameter
            return await ExecuteRequest(HttpMethod.Put, "claims", lead);
        }

        private async Task<CustomerLeadResponse> ExecuteRequest(HttpMethod method, string route, CustomerLeadRequest lead)
        {
            try
            {
                _logger.Info($"{method.Method}'ing Lead", lead, _correlationId.ToString());

                string body = JsonConvert.SerializeObject(lead, new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new CamelCaseNamingStrategy()
                    }
                });

                using (var content = new StringContent(body, Encoding.UTF8, "application/json"))
                {
                    SetupHeaders(content);
                    var request = new HttpRequestMessage
                    {
                        Content = content,
                        RequestUri = new Uri($"{_customerLeadServiceUrl}{route}"),
                        Method = method
                    };
                    HttpResponseMessage response = await _httpClient
                        .SendAsync(request)
                        .ConfigureAwait(false);

                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.Warn($"Error {method.Method}'ing customer lead - Status Code: {response.StatusCode}",
                            await response.Content.ReadAsStringAsync(), _correlationId.ToString());
                        return new CustomerLeadResponse { IsSuccess = false };
                    }

                    string responseBody = await response.Content.ReadAsStringAsync();
                    CustomerLeadResponse leadResponse = JsonConvert.DeserializeObject<CustomerLeadResponse>(SanitizeJsonResponse(responseBody));

                    _logger.Info($"Customer Lead successfully {(method == HttpMethod.Post ? "created" : "updated")}", responseBody, _correlationId.ToString());

                    return leadResponse;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                _logger.Error(ex, $"Exception {method.Method}'ing customer lead", _correlationId.ToString());

                return new CustomerLeadResponse { IsSuccess = false };
            }
        }

        private string SanitizeJsonResponse(string jsonResponse)
        {
            if (string.IsNullOrWhiteSpace(jsonResponse))
            {
                throw new ArgumentNullException(nameof(jsonResponse));
            }

            Match match = RxMsAjaxJsonInner.Match(jsonResponse);
            string innerJson = match.Success ? match.Groups[1].Value : jsonResponse;

            return RxMsAjaxJsonInnerType.Replace(innerJson, string.Empty);
        }
    }
}
