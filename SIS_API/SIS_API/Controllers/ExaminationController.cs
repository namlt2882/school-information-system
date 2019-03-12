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
    public class ExaminationController : ApiController
    {
        ExaminationService service = new ExaminationService();
        [HttpGet]
        [Route("api/Examination")]
        public IEnumerable<ExaminationVM> GetAll()
        {
            var list= service.GetAll();
            return list.Select(i => BaseVM<object>.ToModel<ExaminationVM>(i));
        }

        [HttpGet]
        [Route("api/Examination/{id}")]
        public ExaminationVM Get(int id)
        {
            var exam = service.Get(id);
            return exam == null ? null : BaseVM<object>.ToModel<ExaminationVM>(exam);
        }

        [HttpPost]
        [Route("api/Examination")]
        public ExaminationVM Post(ExaminationVM subject)
        {
            var rs= service.Add(subject.ToEntity());
            return rs == null ? null : BaseVM<object>.ToModel<ExaminationVM>(rs);
        }

        [HttpPut]
        [Route("api/Examination")]
        public void Put(ExaminationVM subject)
        {
            service.Update(subject.ToEntity());
        }

        [HttpDelete]
        [Route("api/Examination/{id}")]
        public void Delete(int id)
        {
            service.Delete(id);
        }
    }
}
