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
                .Where(s => s.Status == (int)StudentEnums.STATUS_ACTIVE);
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