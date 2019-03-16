using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class ClassRepository : BaseRepository<Class>
    {

        public IEnumerable<Class> GetAll()
        {
            var classess = from c in DbContext.Classes
                           where c.Status != (int)ClassEnums.STATUS_DISABLE
                           select c;
            return classess;
        }

        public Class GetClassessOfHomeromeTeacher(string teacher)
        {
            var clazz = DbContext.Classes
                .Where(x => x.Manager == teacher && x.Status != (int)ClassEnums.STATUS_DISABLE)
                .FirstOrDefault();
            return clazz;
        }

        public List<Class> GetClassOfTeacher(string teacher)
        {
            var classess = DbContext.ClassSubjects
                .Where(x => x.Teacher == teacher && x.Status != (int)ClassEnums.STATUS_DISABLE)
                .Select(x => x.Class);
            return classess.ToList();
        }

        public List<ClassMember> GetAllClassMember(int classId)
        {
            var cms = from cm in DbContext.ClassMembers
                      where cm.ClassId == classId && cm.Status == (int)ClassMemberEnums.STATUS_ACTIVE
                      select cm;
            return cms.ToList();
        }

        public ClassMember GetClassMember(int classId, int studentId)
        {
            var cm = DbContext.ClassMembers
                .Where(x => x.ClassId == classId && x.StudentId == studentId)
                .FirstOrDefault();
            return cm;
        }

        public List<ClassSubject> GetSubjectOfClass(int classId)
        {
            var css = from cs in DbContext.ClassSubjects
                      where cs.ClassId == classId && cs.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                      select cs;
            return css.ToList();
        }

        public List<ClassSubject> GetClassSubjectInList(int classId, List<int> subjectIds)
        {
            var css = from cs in DbContext.ClassSubjects
                      where cs.ClassId == classId && subjectIds.Contains(cs.ClassId)
                      && cs.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                      select cs;
            return css.ToList();
        }

        public IQueryable<ClassSubject> GetTeacherCurrentClass(string teacherName)
        {
            var css = from cs in DbContext.ClassSubjects
                      where cs.Teacher == teacherName && cs.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                      && cs.Class.Status == (int)ClassEnums.STATUS_ACTIVE
                      select cs;
            return css;
        }

        public IQueryable<Class> GetHomeroomClass(string teacherName)
        {
            var classes = from c in DbContext.Classes
                          where c.Manager == teacherName && c.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                          select c;
            return classes;
        }

    }
}