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
    [AllowAnonymous]
    public class UserController : ApiController
    {
        UserService service = new UserService();
        ClassService classService = new ClassService();
        [HttpGet]
        [Route("api/User")]
        public IEnumerable<TeacherVM> GetAllUsers()
        {
            IEnumerable<User> list = service.GetAll();
            return list.Select(i =>
            {
                var vm = BaseVM<object>.ToModel<TeacherVM>(i);
                vm.HomeroomClass = classService.GetHomeroomClass(i.Username)
                .Select(c => BaseVM<object>.ToModel<ClassVM>(c));
                vm.TeachingClassQuantity = classService.GetTeacherCurrentClassQuantity(i.Username);
                return vm;
            });
        }
        
        [HttpGet]
        [Route("api/User/{username}")]
        public TeacherVM Get(string username)
        {
            var user = service.GetByUsername(username);
            return user == null ? null : BaseVM<object>.ToModel<TeacherVM>(user);
        }
        
        [HttpPost]
        [Route("api/User")]
        public TeacherVM Post([FromBody]UserCM value)
        {
            UserService service = new UserService();
            User newUser = service.InsertUser(value.ToEntity());
            return BaseVM<object>.ToModel<TeacherVM>(newUser);
        }
        
        [HttpPut]
        [Route("api/User/{username}")]
        public void Put(string username, [FromBody]UserCM value)
        {
            value.Username = username;
            service.Update(value.ToEntity());
        }

        [HttpPut]
        [Route("api/User/{username}/SetPassword")]
        public void SetPassword(string username, [FromBody]SetPasswordModel value)
        {
            service.SetPassword(username, value.Password);
        }
        
        [HttpDelete]
        [Route("api/User/{username}")]
        public void Delete(string username)
        {
            service.Delete(username);
        }

        [HttpPut]
        [Route("api/User/{username}/Ban")]
        public void Ban(string username)
        {
            service.Ban(username);
        }

        [HttpPut]
        [Route("api/User/{username}/Activate")]
        public void Activate(string username)
        {
            service.Activate(username);
        }
    }
    public class SetPasswordModel
    {
        public string Password { get; set; }
    }
}
