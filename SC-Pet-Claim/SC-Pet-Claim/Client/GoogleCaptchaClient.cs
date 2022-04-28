using Newtonsoft.Json;
using SC_Pet_Claim.Common;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SC_Pet_Claim.Client
{
    public class GoogleCaptchaClient
    {
        private static readonly HttpClient Client = new HttpClient();
        private readonly string _verifyUrl;
        private readonly string _clientSecret;
        private readonly bool _recaptchaEnabled;
        private readonly AppInsightsLoggerService<GoogleCaptchaClient> _logger;

        public GoogleCaptchaClient()
        {
            _logger = new AppInsightsLoggerService<GoogleCaptchaClient>();
            _verifyUrl = ConfigurationHelper.GetValue("PetClaim_RecaptchaVerifyUrl");
            _clientSecret = ConfigurationHelper.GetValue("PetClaim_RecaptchaClientSecret");
            bool.TryParse(ConfigurationHelper.GetValue("PetClaim_RecaptchaEnabled"), out _recaptchaEnabled);
        }

        public async Task<bool> Verify(string captchaToken)
        {
            if (!_recaptchaEnabled)
            {
                return true;
            }

            try
            {
                var postParams = new Dictionary<string, string>
                {
                    { "secret", _clientSecret },
                    { "response", captchaToken }
                };

                _logger.Info("Recaptcha validation", new { Client = _clientSecret?.Substring(0, 4), Token = captchaToken });

                using (var postContent = new FormUrlEncodedContent(postParams))
                {
                    HttpResponseMessage response = await Client.PostAsync(_verifyUrl, postContent)
                        .ConfigureAwait(false);

                    if (!response.IsSuccessStatusCode)
                    {
                        _logger.Warn("Recaptcha validation failed", new { StatusCode = response.StatusCode });
                        return false;
                    }

                    _logger.Info("Recaptcha validation succeeded");
                    using (HttpContent content = response.Content)
                    {
                        string result = await content.ReadAsStringAsync();
                        GoogleCaptchaResponse item = JsonConvert.DeserializeObject<GoogleCaptchaResponse>(result);

                        return item.Success;
                    }
                }
            }
            catch (Exception e)
            {
                _logger.Error(e, "Error validating Recaptcha", new { Client = _clientSecret?.Substring(0, 4) });
                Console.WriteLine(e.ToString());
                throw;
            }
        }
    }
}