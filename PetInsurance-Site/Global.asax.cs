using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using PetInsurance.Common;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace PetInsurance_Site
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

            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
        }
    }
}
