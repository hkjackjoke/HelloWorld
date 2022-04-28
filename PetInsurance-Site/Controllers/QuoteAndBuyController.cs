using PetInsurance.Common;
using PetInsurance_Site.Models;
using System.Web.Mvc;

namespace PetInsurance_Site.Controllers
{

    public class QuoteAndBuyController : Controller
    {
        private BrowserDetectionModel Browser;

        [Route("")]
        [Route("applicant-details")]
        [Route("choose-a-plan")]
        [Route("discount-qualification")]
        [Route("quote-summary")]
        [Route("apply/about-you")]
        [Route("apply/some-more-pet-details")]
        [Route("apply/summary")]
        [Route("apply/payment")]
        [Route("apply/submit")]
        [Route("apply/direct-debit")]


        [Route("quote")]
        [Route("quote/applicant-details")]
        [Route("quote/choose-a-plan")]
        [Route("quote/discount-qualification")]
        [Route("quote/quote-summary")]
        [Route("quote/apply/about-you")]
        [Route("quote/apply/some-more-pet-details")]
        [Route("quote/apply/summary")]
        [Route("quote/apply/payment")]
        [Route("quote/apply/submit")]
        [Route("quote/apply/direct-debit")]
        public ActionResult Index()
        {
            var maintenance = ConfigurationHelper.GetValue("PetQnB_IsMaintenance");
            var maintenanceUrl = ConfigurationHelper.GetValue("PetQnB_MaintenanceUrl");
            if (maintenance == "1")
            {
                return Redirect(maintenanceUrl);
            }
            ViewBag.Message = "";
            var useragent = Request.Headers["User-Agent"];
            Browser = new BrowserDetectionModel(useragent);
            return View(Browser);
        }
        [Route("browser-detect")]
        [Route("quote/browser-detect")]
        public ActionResult BrowserDetect()
        {

            var useragent = Request.Headers["User-Agent"];
            Browser = new BrowserDetectionModel(useragent);
            Browser.ShowBrowserDetails = true;
            return View(Browser);
        }
        [Route("error")]
        [Route("quote/error")]
        public ActionResult PetquoteError()
        {

            return View();
        }

        [Route("success")]
        [Route("quote/success")]
        [Route("petquote/success")]
        public ActionResult SuccessPaymentResponse(string quoteId, string securityHash, string result, string userid)
        {
            return Redirect($"/quote/apply/submit?quoteId={quoteId}&secureHash={securityHash}&userId={userid}&result={result}&success=true");
        }

        [Route("failure")]
        [Route("quote/failure")]
        [Route("petquote/failure")]
        public ActionResult FailurePaymentResponse(string quoteId, string securityHash, string result, string userid)
        {
            return Redirect($"/quote/apply/payment?quoteId={quoteId}&secureHash={securityHash}&userId={userid}&result={result}&success=false");
        }
    }
}