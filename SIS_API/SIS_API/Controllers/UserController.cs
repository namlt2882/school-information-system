using SIS_API.Filter;
using SIS_API.Service;
using SIS_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SIS_API.Controllers
{
    [JwtAuthentication]
    public class UserController : ApiController
    {
        UserService service = new UserService();
        // GET: api/User
        [HttpGet]
        [Route("api/User")]
        public IEnumerable<UserVM> GetAllUsers()
        {
            IEnumerable<User> list = service.GetAll();
            return list.Select(i => BaseVM<object>.ToModel<UserVM>(i));
        }

        // GET: api/User/5
        [HttpGet]
        [Route("api/User/{username}")]
        public UserVM Get(string username)
        {
            var user = service.GetByUsername(username);
            return BaseVM<object>.ToModel<UserVM>(user);
        }

        // POST: api/User
        [HttpPost]
        [Route("api/User")]
        public UserVM Post([FromBody]User value)
        {
            UserService service = new UserService();
            User newUser = service.InsertUser(value);
            return BaseVM<object>.ToModel<UserVM>(newUser);
        }

        // PUT: api/User/5
        [HttpPut]
        [Route("api/User/{username}")]
        public void Put(string username, [FromBody]User value)
        {
            value.Username = username;
            service.Update(value);
        }

        // DELETE: api/User/5
        [HttpDelete]
        [Route("api/User/{username}")]
        public void Delete(string username)
        {
            service.Delete(username);
        }
    }
}
