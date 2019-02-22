using Newtonsoft.Json;
using SIS_API.Filter;
using SIS_API.JWT;
using SIS_API.Service;
using SIS_API.Utility;
using SIS_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace SIS_API.Controllers
{
    [JwtAuthentication]
    public class AuthController : ApiController
    {
        AuthenticationService service = new AuthenticationService();
        UserService userService = new UserService();
        [Route("auth/Login")]
        [HttpPost]
        [AllowAnonymous]
        public HttpResponseMessage Login(string username, string password)
        {

            UserVM identity = service.Login(username, password);
            if (identity == null)
            {
                return new HttpResponseMessage(HttpStatusCode.Unauthorized);
            }
            var jwt = JwtManager.GenerateToken(username);
            Authentication auth = new Authentication
            {
                user = identity,
                token = jwt
            };
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new JsonContent(auth)
            };
        }

        [Route("auth/Info")]
        [HttpGet]
        public UserVM GetInfo()
        {
            return null;
        }

    }

    public class Authentication
    {
        public UserVM user { get; set; }
        public string token { get; set; }
    }
}
