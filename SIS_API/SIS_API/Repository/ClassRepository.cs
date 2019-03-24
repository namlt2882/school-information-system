using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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

        public IEnumerable<Class> GetAllActive()
        {
            var classess = from c in DbContext.Classes
                           where c.Status == (int)ClassEnums.STATUS_ACTIVE
                           select c;
            return classess;
        }

        public List<ClassMember> GetAllClassMember(int classId)
        {
            var cms = from cm in DbContext.ClassMembers
                      where cm.ClassId == classId && cm.Status == (int)ClassMemberEnums.STATUS_ACTIVE
                      select cm;
            return cms.ToList();
        }

        public List<ClassSubject> GetSubjectOfClass(int classId)
        {
            var css = from cs in DbContext.ClassSubjects
                      where cs.ClassId == classId && cs.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                      select cs;
            return css.ToList();
        }

        public IQueryable<ClassSubject> GetTeachingClass(string teacherName)
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

        public void UpdateClassess(List<Class> list)
        {
            lock (DbContext)
            {
                using (var transaction = DbContext.Database.BeginTransaction())
                {
                    try
                    {
                        foreach (Class c in list)
                        {
                            DbContext.Entry(c).State = EntityState.Modified;
                        }
                        DbContext.SaveChanges();
                        transaction.Commit();
                        foreach (Class c in list)
                        {
                            UpdateContext(c);
                        }
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        throw e;
                    }
                }
            }
        }

        public void UpdateClassSubjects(List<ClassSubject> list)
        {
            lock (DbContext)
            {
                using (var transaction = DbContext.Database.BeginTransaction())
                {
                    try
                    {
                        foreach (ClassSubject cs in list)
                        {
                            DbContext.Entry(cs).State = EntityState.Modified;
                        }
                        DbContext.SaveChanges();
                        transaction.Commit();
                        foreach (ClassSubject cs in list)
                        {
                            UpdateContext(cs);
                        }
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        throw e;
                    }
                }
            }
        }

        public void UpdateClassMembers(List<ClassMember> list)
        {
            lock (DbContext)
            {
                using (var transaction = DbContext.Database.BeginTransaction())
                {
                    try
                    {
                        foreach (ClassMember cm in list)
                        {
                            DbContext.Entry(cm).State = EntityState.Modified;
                        }
                        DbContext.SaveChanges();
                        transaction.Commit();
                        foreach (ClassMember cm in list)
                        {
                            UpdateContext(cm);
                        }
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        throw e;
                    }
                }
            }
        }

        public IEnumerable<Class> GetStudentCurrentClass(int studentId)
        {
            var classes = from cs in DbContext.ClassMembers
                          where cs.Status == (int)ClassMemberEnums.STATUS_ACTIVE
                          && cs.Class.Status == (int)ClassEnums.STATUS_ACTIVE
                          && cs.StudentId == studentId
                          select cs.Class;
            return classes;
        }

        public IEnumerable<Class> GetStudentClosedClass(int studentId)
        {
            var classes = from cs in DbContext.ClassMembers
                          where cs.Status == (int)ClassMemberEnums.STATUS_ACTIVE
                          && cs.Class.Status == (int)ClassEnums.STATUS_CLOSED
                          && cs.StudentId == studentId
                          select cs.Class;
            return classes;
        }

        public IEnumerable<ClassMember> GetStudentCurrentClassMember(int studentId)
        {
            var classMember = from cm in DbContext.ClassMembers
                          where cm.Status == (int)ClassMemberEnums.STATUS_ACTIVE
                          && cm.Class.Status == (int)ClassEnums.STATUS_ACTIVE
                          && cm.StudentId == studentId
                          select cm;
            return classMember;
        }

    }
}