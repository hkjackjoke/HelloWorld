using System.Web;
using System.Web.Optimization;

namespace PetInsurance_Site
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                   "~/Scripts/jquery-1.10.2.js"
            // "~/Scripts/jquery.easing.js"
            ));

#if DEBUG
            bundles.Add(new ScriptBundle("~/bundles/petquote-dev").Include(
                   "~/Scripts/hammer.min.js",
                   "~/Scripts/TweenMax.min.js",
                   "~/Scripts/dev/runtime*",
                   "~/Scripts/dev/polyfills*",
                   "~/Scripts/dev/scripts*",
                   "~/Scripts/dev/vendor*",
                   "~/Scripts/dev/main*",
                   "~/Scripts/petQuoteScripts.js"
            ));
#else
            bundles.Add(new ScriptBundle("~/bundles/petquote").Include(
                   "~/Scripts/hammer.min.js",
                   "~/Scripts/TweenMax.min.js",
                   "~/Scripts/libs/runtime*",
                   "~/Scripts/libs/polyfills*",
                   "~/Scripts/libs/scripts*",
                   "~/Scripts/libs/vendor*",
                   "~/Scripts/libs/main*",
                   "~/Scripts/petQuoteScripts.js"
            ));
#endif

            bundles.Add(new StyleBundle("~/Content/petquote").Include(
                    "~/Content/css/browser-error.css",
                    "~/Content/css/common.css",
                    "~/Content/css/confirmation-page.css",
                    "~/Content/css/css-animations.css",
                    "~/Content/css/fonts.css",
                    "~/Content/css/footer.css",
                    "~/Content/css/header.css",
                    "~/Content/css/help.css",
                    "~/Content/css/main.css",
                    "~/Content/css/menu-burger.css",
                    "~/Content/css/petquote.css"
            ));

        }
    }
}
