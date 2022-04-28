using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using SC_Pet_Claim.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace SC_Pet_Claim
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Setup App Insights
            var configuration = TelemetryConfiguration.CreateDefault();
            configuration.InstrumentationKey = ConfigurationHelper.GetValue("APPINSIGHTS_INSTRUMENTATIONKEY");

            _ = new TelemetryClient(configuration);
        }
    }
}
