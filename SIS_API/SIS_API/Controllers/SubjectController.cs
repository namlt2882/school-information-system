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
    //[JwtAuthentication]
    [AllowAnonymous]
    public class SubjectController : ApiController
    {
        SubjectService service = new SubjectService();
        [HttpGet]
        [Route("api/Subject")]
        public IEnumerable<SubjectVM> GetAll()
        {
            var subjects = service.GetAll();
            return subjects.Select(i => BaseVM<object>.ToModel<SubjectVM>(i));
        }

        [HttpGet]
        [Route("api/Subject/{id}")]
        public SubjectVM Get(int id)
        {
            var subject = service.Get(id);
            return subject == null ? null : BaseVM<object>.ToModel<SubjectVM>(subject);
        }

        [HttpPost]
        [Route("api/Subject")]
        public SubjectVM Post(SubjectVM subject)
        {
            var rs = service.Add(subject.ToEntity());
            return rs == null ? null : BaseVM<object>.ToModel<SubjectVM>(rs);
        }

        [HttpPut]
        [Route("api/Subject")]
        public void Put(SubjectVM subject)
        {
            service.Update(subject.ToEntity());
        }

        [HttpDelete]
        [Route("api/Subject/{id}")]
        public void Delete(int id)
        {
            service.Delete(id);
        }
    }
}
