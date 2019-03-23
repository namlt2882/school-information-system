using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class StudentRepository : BaseRepository<Student>
    {
        public IEnumerable<Student> GetAll()
        {
            var students = DbContext.Students
                .Where(s => s.Status != (int)StudentEnums.STATUS_DISABLE);
            return students;
        }

        public IEnumerable<Student> GetNoClassStudent()
        {
            // get has class student (student are in some active class)
            var hasClassStudent = from member in DbContext.ClassMembers
                                  where member.Class.Status == (int)ClassEnums.STATUS_ACTIVE
                                  && member.Status == (int)ClassMemberEnums.STATUS_ACTIVE
                                  select member.Student;
            var students = from student in DbContext.Students
                           where student.Status == (int)StudentEnums.STATUS_ACTIVE 
                           && !hasClassStudent.Any(hc => hc.Id == student.Id)
                           select student;
            return students;
        }

        public IEnumerable<Student> GetGraduatedStudents()
        {
            var students = DbContext.Students
                .Where(s => s.Status == (int)StudentEnums.STATUS_GRADUATED);
            return students;
        }

        public List<Student> GetStudentOfClass(int classId)
        {
            var students = from cm in DbContext.ClassMembers
                           where cm.ClassId == classId && cm.Status != (int)StudentEnums.STATUS_DISABLE
                           select cm.Student;
            return students.ToList();
        }

    }
}