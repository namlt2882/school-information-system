using SIS_API.Service;
using SIS_API.Utility;
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
            return list.Select(i =>
            {
                var vm = BaseVM<object>.ToModel<ClassVM>(i);
                vm.SubjectQuantity = i.ClassSubjects
                .Where(cs => cs.Status != (int)ClassSubjectEnums.STATUS_DISABLE).Count();
                vm.StudentQuantity = i.ClassMembers
                .Where(cm => cm.Status != (int)ClassMemberEnums.STATUS_DISABLE).Count();
                return vm;
            });
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
                    .Select(cs =>
                    {
                        var vm = BaseVM<object>.ToModel<SubjectVM>(cs.Subject);
                        vm.Teacher = cs.User != null ? BaseVM<object>.ToModel<UserVM>(cs.User) : null;
                        //calculate subject average
                        var subjectAverage = cs.AcademicTranscripts
                        .Where(tran => tran.Status != (int)TranscriptEnums.STATUS_DISABLE)
                        .Aggregate(0d, (acc, t) =>
                        {
                            double score = t.Score.HasValue ? t.Score.Value : 0d;
                            acc += (score * t.PercentRate.Value) / 100;
                            return acc;
                        });
                        subjectAverage /= rs.Students.Count;
                        vm.AverageScore = subjectAverage;
                        return vm;
                    })
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
        [Route("api/Class/{id}")]
        public void Put(int id, [FromBody]ClassVM subject)
        {
            subject.Id = id;
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
        public List<ClassSubjectModel> SubjectIds { get; set; }
    }
    public class ClassSubjectModel
    {
        public int SubjectId { get; set; }
        public string TeacherId { get; set; }
    }
}
