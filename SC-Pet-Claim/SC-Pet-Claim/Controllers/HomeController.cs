using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Threading.Tasks;
using SC_Pet_Claim.Models;
using Newtonsoft.Json;
using SC_Pet_Claim.Client;

// using SC_Pet_Claim.Scripts;

namespace SC_Pet_Claim.Controllers
{

    public class HomeController : Controller
    {
        private BrowserDetectionModel Browser;
        private readonly GoogleCaptchaClient _captchaClient;
        public HomeController()
        {
            _captchaClient = new GoogleCaptchaClient();
        }

        [Route("")]
        [Route("your-details")]
        [Route("claim-details")]
        [Route("upload-documents")]
        [Route("review-claim")]
        [Route("confirmation")]
        [Route("make-a-claim")]
        [Route("make-a-claim/your-details")]
        [Route("make-a-claim/claim-details")]
        [Route("make-a-claim/upload-documents")]
        [Route("make-a-claim/review-claim")]
        [Route("make-a-claim/confirmation")]
        public ActionResult Index()
        {
            var useragent = Request.Headers["User-Agent"];
            Browser = new BrowserDetectionModel(useragent);
            return View(Browser);
        }
        [Route("submit-application")]
        [Route("make-a-claim/submit-application")]
        [HttpPost]
        public ActionResult SubmitApplication(ApplicationModel formData)
        {
            var captchaResult = _captchaClient.Verify(formData.CaptchaToken)
                .GetAwaiter()
                .GetResult();

            if (!captchaResult)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            return Json(formData.Submit());
        }
        [Route("get-vets")]
        [Route("make-a-claim/get-vets")]
        public ActionResult GetVets()
        {
            return Json(this.GetJsonData("vets.json"), JsonRequestBehavior.AllowGet);
        }
        private Organisation[] GetJsonData(string filename)
        {
            string file = Server.MapPath("~/App_Data/" + filename);
            return JsonConvert.DeserializeObject<Organisation[]>(System.IO.File.ReadAllText(file));
        }

        [Route("browser-detect")]
        [Route("make-a-claim/browser-detect")]
        public ActionResult BrowserDetect()
        {

            var useragent = Request.Headers["User-Agent"];
            Browser = new BrowserDetectionModel(useragent);
            Browser.ShowBrowserDetails = true;
            return View(Browser);
        }
    }

}