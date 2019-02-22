using System.Web.Http;
using WebActivatorEx;
using SIS_API;
using Swashbuckle.Application;
using SIS_API.Filter;

[assembly: PreApplicationStartMethod(typeof(SwaggerConfig), "Register")]

namespace SIS_API
{
    public class SwaggerConfig
    {
        public static void Register()
        {
            var thisAssembly = typeof(SwaggerConfig).Assembly;

            GlobalConfiguration.Configuration
                .EnableSwagger(c =>
                    {
                        c.SingleApiVersion("v1", "SIS_API Swagger UI");
                        c.ApiKey("Token").Description("Filling bearer token here")
                        .Name("Authorization").In("header");
                        c.OperationFilter<AddAuthorizationHeaderParameterOperationFilter>();
                    })
                .EnableSwaggerUi();
        }
    }
}
