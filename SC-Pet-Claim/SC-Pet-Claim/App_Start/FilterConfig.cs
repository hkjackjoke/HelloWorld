using System.Web;
using System.Web.Mvc;
using SC_Pet_Claim.ErrorHandler;

namespace SC_Pet_Claim
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new AiHandleErrorAttribute());
        }
    }
}
