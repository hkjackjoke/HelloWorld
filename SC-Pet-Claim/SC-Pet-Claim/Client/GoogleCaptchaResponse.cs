using System.Collections.Generic;
using Newtonsoft.Json;

namespace SC_Pet_Claim.Client
{
    public class GoogleCaptchaResponse
    {
        public bool Success { get; set; }
        [JsonProperty("error-codes")]
        public List<string> ErrorCodes { get; set; }
    }
}
