using Newtonsoft.Json;
using SC_Pet_Claim.Common;
using SC_Pet_Claim.Models;
using System;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace SC_Pet_Claim.Client
{
    public class PetClaimServiceHttpClient
    {
        private static readonly HttpClient _httpClient = new HttpClient()
        {
            Timeout = TimeSpan.FromMinutes(5)
        };

        private static readonly Regex RxMsAjaxJsonInner =
            new Regex("^{\\s*\"d\"\\s*:(.*)}$", RegexOptions.Compiled);

        private static readonly Regex RxMsAjaxJsonInnerType =
            new Regex("\\s*\"__type\"\\s*:\\s*\"[^\"]*\"\\s*,\\s*", RegexOptions.Compiled);

        private readonly string _petClaimServiceUrl;
        private readonly string _subscriptionKey;
        private readonly Guid _correlationId = Guid.NewGuid();
        private readonly AppInsightsLoggerService<PetClaimServiceHttpClient> _logger;

        public PetClaimServiceHttpClient()
        {
            _logger = new AppInsightsLoggerService<PetClaimServiceHttpClient>();
            _petClaimServiceUrl = ConfigurationHelper.GetValue("PetClaim_ServiceUrl");
            _subscriptionKey = ConfigurationHelper.GetValue("PetClaim_Ocp-Apim-Subscription-Key");
        }

        private void SetupHeaders(HttpContent content, string securityHash = null)
        {
            content.Headers.Add("X-Organisation-Correlation-Id", _correlationId.ToString());
            content.Headers.Add("Ocp-Apim-Subscription-Key", _subscriptionKey);
            content.Headers.Add("Security-Hash", securityHash);
        }

        public async Task<ClaimResponse> CreateClaimAsync(ApiModel model)
        {
            try
            {
                _logger.Info("Creating claim", model, _correlationId.ToString());

                const string route = "claims";

                string postBody = JsonConvert.SerializeObject(model);

                using (var content = new StringContent(postBody, Encoding.UTF8, "application/json"))
                {
                    SetupHeaders(content);

                    HttpResponseMessage response = await _httpClient.PostAsync($"{_petClaimServiceUrl}{route}", content)
                        .ConfigureAwait(false);

                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.Warn($"Error creating claim - Status Code: {response.StatusCode}",
                            await response.Content.ReadAsStringAsync(), _correlationId.ToString());
                        return new ClaimResponse { Success = false };
                    }

                    string responseBody = await response.Content.ReadAsStringAsync();
                    ClaimResponse claimResponse =
                        JsonConvert.DeserializeObject<ClaimResponse>(SanitizeJsonResponse(responseBody));

                    _logger.Info("Claim successfully created", responseBody, _correlationId.ToString());

                    return claimResponse;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                _logger.Error(ex, "Exception creating claim", _correlationId.ToString());
                return new ClaimResponse { Success = false };
            }
        }

        public async Task CreateClaimAttachmentAsync(string referenceNo, string securityHash, string docType,
            HttpPostedFile file)
        {
            try
            {
                _logger.Info("Creating attachment", new { FileName = file.FileName, ReferenceNumber = referenceNo }, _correlationId.ToString());

                string route = $"claims/{HttpUtility.UrlEncode(referenceNo)}/attachments";

                using (var content = new MultipartFormDataContent())
                {
                    SetupHeaders(content, securityHash);
                    content.Headers.ContentType.MediaType = "multipart/form-data";

                    content.Add(new StringContent(docType), "DocType");
                    content.Add(new StreamContent(file.InputStream), "File", file.FileName);

                    _ = await _httpClient.PostAsync($"{_petClaimServiceUrl}{route}", content)
                        .ConfigureAwait(false);
                }

                _logger.Info("Attachment successfully created", new { FileName = file.FileName, ReferenceNumber = referenceNo }, _correlationId.ToString());
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error creating attachment", new { FileName = file.FileName, ReferenceNumber = referenceNo }, _correlationId.ToString());
                Trace.TraceError(ex.ToString());
                Debug.Write(ex.ToString());
                // Do not rethrow errors as failing to add the attachment should not 
                // block the claim from being submitted
            }
        }

        public async Task FinishClaimAsync(string referenceNo, string securityHash)
        {
            try
            {
                _logger.Info("Finishing claim", new { ReferenceNumber = referenceNo }, _correlationId.ToString());
                string route = $"claims/{HttpUtility.UrlEncode(referenceNo)}";
                using (var content = new StringContent(string.Empty, Encoding.UTF8, "application/json"))
                {
                    SetupHeaders(content, securityHash);

                    _ = await _httpClient.PutAsync($"{_petClaimServiceUrl}{route}", content)
                        .ConfigureAwait(false);
                }
                _logger.Info("Claim successfully finished", new { ReferenceNumber = referenceNo }, _correlationId.ToString());
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error finishing the claim", new { ReferenceNumber = referenceNo }, _correlationId.ToString());
                Debug.Write(ex.ToString());
                throw;
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