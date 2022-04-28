using System.Collections.Generic;
using Newtonsoft.Json;

namespace PetInsurance.DataAccessLayer
{
    public class GoogleCaptchaResponse
    {
        public bool Success { get; set; }
        [JsonProperty("error-codes")]
        public List<string> ErrorCodes { get; set; }
    }
}
