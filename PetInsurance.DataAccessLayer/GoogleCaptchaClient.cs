using Newtonsoft.Json;
using PetInsurance.Common;
using PetInsurance.Common.Logging;
using SX.API.Common.Shared.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace PetInsurance.DataAccessLayer
{
    public class GoogleCaptchaClient
    {
        private readonly ILoggerService<GoogleCaptchaClient> _logger;
        private static readonly HttpClient Client = new HttpClient();
        private readonly string _verifyUrl;
        private readonly string _clientSecret;
        private readonly IEnumerable<string> _pathsEnabled;

        public GoogleCaptchaClient()
        {
            _logger = new AppInsightsLoggerService<GoogleCaptchaClient>();
            _verifyUrl = ConfigurationHelper.GetValue("PetQnB_RecaptchaVerifyUrl");
            _clientSecret = ConfigurationHelper.GetValue("PetQnB_RecaptchaClientSecret");
            _pathsEnabled = ConfigurationHelper.GetValue("PetQnB_RecaptchaRequiredPaths").Split(';');
        }

        public async Task<ApiResponse<GoogleCaptchaResponse>> Verify(string path, string captchaToken)
        {
            // Only do a recaptcha verify for the endpoints defined in config
            if (!_pathsEnabled.Select(p => p.ToLower()).Contains(path.ToLower()))
            {
                return new ApiResponse<GoogleCaptchaResponse>()
                {
                    Message = "Recaptcha Skipped",
                    Success = true
                };
            }

            return await Verify(captchaToken);
        }

        public async Task<ApiResponse<GoogleCaptchaResponse>> Verify(string captchaToken)
        {

            var postParams = new Dictionary<string, string>
            {
                { "secret", _clientSecret },
                { "response", captchaToken }
            };

            using (var postContent = new FormUrlEncodedContent(postParams))
            using (var response = await Client.PostAsync(_verifyUrl, postContent))
            {
                if (!response.IsSuccessStatusCode)
                {
                    return new ApiResponse<GoogleCaptchaResponse>
                    {
                        Success = false,
                        Message = response.ReasonPhrase,
                        StatusCode = response.StatusCode
                    };
                }

                using (var content = response.Content)
                {
                    var result = await content.ReadAsStringAsync();

                    _logger.Debug("Google Recaptcha result", result);

                    var item = JsonConvert.DeserializeObject<GoogleCaptchaResponse>(result);

                    if (item.Success)
                    {
                        return new ApiResponse<GoogleCaptchaResponse>
                        {
                            Item = item,
                            Success = true,
                            StatusCode = HttpStatusCode.OK
                        };
                    }

                    _logger.Warn("Recaptcha token failed to verify", item);

                    return new ApiResponse<GoogleCaptchaResponse>
                    {
                        Item = item,
                        Message = "Recaptcha failed to verify",
                        Success = false,
                        StatusCode = HttpStatusCode.BadRequest
                    };
                }
            }
        }
    }
}
