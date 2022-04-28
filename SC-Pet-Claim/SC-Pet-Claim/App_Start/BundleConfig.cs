using System.Web.Optimization;

namespace SC_Pet_Claim
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

#if DEBUG
            bundles.Add(new ScriptBundle("~/bundles/angular-dev").Include(
                        "~/Scripts/lazyload.min.js",
                        "~/Scripts/dev/runtime*",
                        "~/Scripts/dev/polyfills*",
                        "~/Scripts/dev/common*",
                        "~/Scripts/dev/main*"
                        ));
#else
            bundles.Add(new ScriptBundle("~/bundles/angular-prod").Include(
                    "~/Scripts/lazyload.min.js",
                    "~/Scripts/libs/runtime*",
                    "~/Scripts/libs/polyfills*",
                    "~/Scripts/libs/common*",
                    "~/Scripts/libs/main*"
                    ));
#endif

            bundles.Add(new StyleBundle("~/Content/styles").Include(
                      "~/Content/css/main.css"
                      ));

            bundles.Add(new StyleBundle("~/Content/criticalStyles").Include(
                      "~/Content/css/criticalStyles.min.css"
                      ));
        }
    }
}
