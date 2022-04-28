using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace PetInsurance_Site
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("content/images/{*pathInfo}");
            routes.IgnoreRoute("quote/content/images/{*pathInfo}");

            routes.LowercaseUrls = true;
            routes.MapMvcAttributeRoutes();

            routes.MapHttpRoute(
                name: "ConfigApi",
                routeTemplate: "api/config",
                defaults: new
                {
                    controller = "ConfigApi",
                    path = RouteParameter.Optional
                }
            );

            routes.MapHttpRoute(
                name: "ConfigApiAlt",
                routeTemplate: "quote/api/config",
                defaults: new
                {
                    controller = "ConfigApi",
                    path = RouteParameter.Optional
                }
            );

            routes.MapHttpRoute(
                name: "QuoteAndBuyApi",
                routeTemplate: "api/{*path}",
                defaults: new
                {
                    controller = "QuoteAndBuyApi",
                    path = RouteParameter.Optional
                }
            );

            routes.MapHttpRoute(
                name: "QuoteAndBuyApiAlt",
                routeTemplate: "quote/api/{*path}",
                defaults: new
                {
                    controller = "QuoteAndBuyApi",
                    path = RouteParameter.Optional
                }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
