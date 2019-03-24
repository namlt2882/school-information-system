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
    public class StudentController : ApiController
    {
        StudentService service = new StudentService();
        ClassService classService = new ClassService();
        [HttpGet]
        [Route("api/Student")]
        public IEnumerable<StudentVM> GetAll()
        {
            var students = service.GetAllActive();
            return students.Select(i =>
            {
                var vm = BaseVM<object>.ToModel<StudentVM>(i);
                var clazz = classService.GetStudentCurrentClass(i.Id);
                var closedClasses = classService.GetStudentClosedClass(i.Id);
                if (clazz != null)
                {
                    vm.CurrentClass = BaseVM<object>.ToModel<ClassVM>(clazz);
                }
                vm.ClosedClasses = closedClasses.Select(cc => BaseVM<object>.ToModel<ClassVM>(cc));
                return vm;
            });
        }

        [HttpGet]
        [Route("api/Student/GetNoClassStudent")]
        public IEnumerable<StudentVM> GetNoClassStudent()
        {
            var students = service.GetNoClassStudent();
            return students.Select(i => BaseVM<object>.ToModel<StudentVM>(i));
        }

        [HttpGet]
        [Route("api/Student/GetAllGratudatedStudents")]
        public IEnumerable<StudentVM> GetAllGraduatedStudents()
        {
            var students = service.GetAllGraduated();
            return students.Select(i => BaseVM<object>.ToModel<StudentVM>(i));
        }

        [HttpGet]
        [Route("api/Student/{id}")]
        public StudentVM Get(int id)
        {
            var student = service.Get(id);
            return student == null ? null : BaseVM<object>.ToModel<StudentVM>(student);
        }

        [HttpPost]
        [Route("api/Student")]
        public StudentVM Post(StudentVM subject)
        {
            var rs = service.Add(subject.ToEntity());
            return rs == null ? null : BaseVM<object>.ToModel<StudentVM>(rs);
        }

        [HttpPut]
        [Route("api/Student")]
        public void Put(StudentVM subject)
        {
            service.Update(subject.ToEntity());
        }

        [HttpDelete]
        [Route("api/Student/{id}")]
        public void Delete(int id)
        {
            service.Delete(id);
        }

        [HttpPut]
        [Route("api/Student/{id}/SetGraduated")]
        public void SetGraduated(int id)
        {
            service.SetGraduated(id);
        }
    }
}
