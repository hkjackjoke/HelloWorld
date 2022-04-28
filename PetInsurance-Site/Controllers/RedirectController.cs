using PetInsurance.Common;
using System.Web.Mvc;
using System.Web.Routing;

namespace PetInsurance_Site.Controllers
{
    public class RedirectController : Controller
    {
        [Route("Offers")]
        [Route("Offers/{path}")]
        [Route("freecover")]
        [Route("freecover/{path}")]
        public ActionResult FreeCoverRedirect(string path)
        {
            string url = ConfigurationHelper.GetValue("PetQnB_FreeCoverUrl");
            return Redirect($"{url}/{path}");
        }

        [Route("puppycover")]
        [Route("puppycover/{path}")]
        public ActionResult PuppyCoverRedirect(string path)
        {
            string url = ConfigurationHelper.GetValue("PetQnB_PuppyCoverUrl");
            return Redirect($"{url}/{path}");
        }

        [Route("spcacover")]
        [Route("spcacover/{path}")]
        public ActionResult SpcaCoverRedirect(string path)
        {
            string url = ConfigurationHelper.GetValue("PetQnB_SpcaCoverUrl");
            return Redirect($"{url}/{path}");
        }

        [Route("directdebitauthority")]
        [Route("directdebitauthority/{path}")]
        public ActionResult DirectDebitAuthorityRedirect(string path)
        {
            string url = ConfigurationHelper.GetValue("PetQnB_DirectDebitUrl");
            return Redirect($"{url}/{path}");
        }

        [Route("society/{path}")]
        [Route("-/{path}")]
        public ActionResult SiteCoreRedirect(string path)
        {
            string scDomain = ConfigurationHelper.GetValue("PetQnB_SoutherncrossDomain");
            string requestUrl = Request.RawUrl;
            return Redirect(scDomain + requestUrl);
        }
    }
}