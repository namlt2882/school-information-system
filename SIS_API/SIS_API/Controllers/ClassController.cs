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
    public class ClassController : ApiController
    {
        ClassService service = new ClassService();
        [HttpGet]
        [Route("api/Class")]
        public IEnumerable<ClassVM> GetAll()
        {
            var list = service.GetAll();
            return list.Select(i => BaseVM<object>.ToModel<ClassVM>(i));
        }

        [HttpGet]
        [Route("api/Class/{id}")]
        public ClassFM Get(int id)
        {
            var origin = service.Get(id);
            return EntityToFM(origin);
        }

        public ClassFM EntityToFM(Class origin)
        {
            ClassFM rs = null;
            if (origin != null)
            {
                rs = BaseVM<object>.ToModel<ClassFM>(origin);
                rs.Students = origin.ClassMembers
                    .Select(cm => BaseVM<object>.ToModel<StudentVM>(cm.Student))
                    .ToList();
                rs.Subjects = origin.ClassSubjects
                    .Select(cs => BaseVM<object>.ToModel<SubjectVM>(cs.Subject))
                    .ToList();
            }
            return rs;
        }

        [HttpPost]
        [Route("api/Class")]
        public ClassVM Post(ClassVM subject)
        {
            var rs = service.Add(subject.ToEntity());
            return rs == null ? null : BaseVM<object>.ToModel<ClassVM>(rs);
        }

        [HttpPut]
        [Route("api/Class")]
        public void Put(ClassVM subject)
        {
            service.Update(subject.ToEntity());
        }

        [HttpDelete]
        [Route("api/Class/{id}")]
        public void Delete(int id)
        {
            service.Delete(id);
        }

        [HttpPut]
        [Route("api/Class/{id}/Close")]
        public void Close(int id)
        {
            service.Close(id);
        }

        [HttpPost]
        [Route("api/Class/AddStudent")]
        public ClassMemberVM AddStudent(AddStudentModel model)
        {
            var list = service.AddStudentToClass(model.ClassId, model.StudentIds);
            return new ClassMemberVM
            {
                ClassId = model.ClassId,
                StudentIds = list.Select(x => x.StudentId).ToList()
            };
        }

        [HttpPut]
        [Route("api/Class/RemoveStudent")]
        public ClassMemberVM RemoveStudent(AddStudentModel model)
        {
            var list = service.RemoveStudentFromClass(model.ClassId, model.StudentIds);
            return new ClassMemberVM
            {
                ClassId = model.ClassId,
                StudentIds = list.Select(x => x.StudentId).ToList()
            };
        }

        [HttpPost]
        [Route("api/Class/AddSubject")]
        public ClassSubjectVM AddSubject(AddSubjectModel model)
        {
            var list = service.AddSubjectToClass(model.ClassId, model.SubjectIds);
            return new ClassSubjectVM
            {
                ClassId = model.ClassId,
                SubjectIds = list.Select(x => x.SubjectId).ToList()
            };
        }

        [HttpPut]
        [Route("api/Class/RemoveSubject")]
        public ClassSubjectVM RemoveSubject(AddSubjectModel model)
        {
            var list = service.RemoveSubjectFromClass(model.ClassId, model.SubjectIds);
            return new ClassSubjectVM
            {
                ClassId = model.ClassId,
                SubjectIds = list.Select(x => x.SubjectId).ToList()
            };
        }
    }

    public class AddStudentModel
    {
        public int ClassId { get; set; }
        public List<int> StudentIds { get; set; }
    }
    public class AddSubjectModel
    {
        public int ClassId { get; set; }
        public List<int> SubjectIds { get; set; }
    }
}
