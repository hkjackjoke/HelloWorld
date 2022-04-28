using PetInsurance.Common;
using PetInsurance.Common.Logging;
using PetInsurance.DataAccessLayer;
using PetInsurance_Site.Models;
using System.Threading.Tasks;
using System.Web.Http;

namespace PetInsurance_Site.Controllers
{
    [Route("leadApi")]
    [Route("quote/leadApi")]
    public class CustomerLeadApiController : ApiController
    {
        private readonly LeadServiceHttpClient _leadServiceClient;
        private readonly GoogleCaptchaClient _captchaClient;
        private readonly AppInsightsLoggerService<CustomerLeadApiController> _logger = new AppInsightsLoggerService<CustomerLeadApiController>();

        public CustomerLeadApiController()
        {
            _leadServiceClient = new LeadServiceHttpClient();
            _captchaClient = new GoogleCaptchaClient();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post([FromBody] CustomerLeadModel body)
        {
            // TODO: This needs to be removed once the microservice environment is ready
            var customerLeadEnabled = ConfigurationHelper.GetValue<bool>("PetQnB_CustomerLeadEnabled");
            if (!customerLeadEnabled)
                return Ok(1);
            //

            if (!await ValidateCaptchaAsync("POST", body.Token)) return BadRequest();

            var request = body.ToCustomerLeadRequest();
            var result = await _leadServiceClient.CreateCustomerLeadAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest();
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<IHttpActionResult> Put([FromBody] CustomerLeadModel body)
        {
            // TODO: This needs to be removed once the microservice environment is ready
            var customerLeadEnabled = ConfigurationHelper.GetValue<bool>("PetQnB_CustomerLeadEnabled");
            if (!customerLeadEnabled)
                return Ok(1);
            //

            if (!await ValidateCaptchaAsync("PUT", body.Token)) return BadRequest();

            var request = body.ToCustomerLeadRequest();
            var result = await _leadServiceClient.UpdateCustomerLeadAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest();
            }

            return Ok(result);
        }

        private async Task<bool> ValidateCaptchaAsync(string verb, string token)
        {
            // Validates Google captcha token
            ApiResponse<GoogleCaptchaResponse> captchaResult = await _captchaClient.Verify(token);

            if (!captchaResult.Success)
            {
                _logger.Error($"Captcha token for HTTP {verb} is invalid on {nameof(CustomerLeadApiController)}", captchaResult);
                return false;
            }

            return true;
        }
    }
}