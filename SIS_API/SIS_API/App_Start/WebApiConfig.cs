using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace SIS_API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            config.Filters.Add(new AuthorizeAttribute());

            // Web API routes
            config.MapHttpAttributeRoutes();
            //config.EnableCors(new EnableCorsAttribute("https://sis-web.azurewebsites.net", "*", "GET, PUT, POST, DELETE, HEAD"));
            config.EnableCors(new EnableCorsAttribute("*", "*", "GET, PUT, POST, DELETE, HEAD"));
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
