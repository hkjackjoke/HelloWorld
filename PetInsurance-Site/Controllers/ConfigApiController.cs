using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using PetInsurance.Common;
using PetInsurance_Site.Models;
using System.Web.Http;
using System.Web.Routing;

namespace PetInsurance_Site.Controllers
{
    [Route("api/config")]
    [Route("quote/api/config")]
    public class ConfigApiController : ApiController
    {
        [HttpGet]
        public IHttpActionResult Get()
        {
            var config = new ConfigModel
            {
                CaptchaToken = ConfigurationHelper.GetValue("PetQnB_RecaptchaClientToken")
            };

            var camelCaseFormatter = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            return Json(config, camelCaseFormatter);
        }
    }
}