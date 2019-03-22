using SIS_API.Controllers;
using SIS_API.Repository;
using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace SIS_API.Service
{
    public class ClassService
    {
        ClassRepository repository = new ClassRepository();

        public IEnumerable<Class> GetAll()
        {
            return repository.GetAll();
        }
        public Class Get(int id)
        {
            var clazz = repository.Get(id);
            if (clazz != null && clazz.Status == (int)ClassEnums.STATUS_DISABLE)
            {
                clazz = null;
            }
            //get class member which is active
            clazz.ClassMembers = new Collection<ClassMember>
                (clazz.ClassMembers.Where(cm => cm.Status == (int)ClassMemberEnums.STATUS_ACTIVE).ToList());
            //get class subject which is active
            clazz.ClassSubjects = new Collection<ClassSubject>
                (clazz.ClassSubjects.Where(cs => cs.Status == (int)ClassSubjectEnums.STATUS_ACTIVE).ToList());
            return clazz;
        }
        public Class Add(Class clazz)
        {
            clazz.Id = 0;
            clazz.Status = (int)ClassEnums.STATUS_ACTIVE;
            clazz.InsertDate = DateTime.Now;
            return repository.Insert(clazz);
        }

        public void Update(Class clazz)
        {
            var origin = repository.Get(clazz.Id);
            origin.Name = clazz.Name;
            origin.Manager = clazz.Manager;
            repository.Update(origin);
        }

        public void Delete(int id)
        {
            var origin = repository.Get(id);
            origin.Status = (int)ClassEnums.STATUS_DISABLE;
            repository.Update(origin);
        }

        public void Close(int id)
        {
            var origin = repository.Get(id);
            origin.Status = (int)ClassEnums.STATUS_CLOSED;
            repository.Update(origin);
        }

        public IEnumerable<ClassMember> AddStudentToClass(int classId, List<int> studentIds)
        {
            var origin = repository.Get(classId);
            var rs = new List<ClassMember>();
            var newStudentIds = new List<int>();
            //create new class member
            studentIds.ForEach(i =>
            {
                var found = origin.ClassMembers.Where(cm => cm.StudentId == i).FirstOrDefault();
                if (found == null)
                {
                    var classMember = new ClassMember
                    {
                        Id = 0,
                        Status = (int)ClassMemberEnums.STATUS_ACTIVE,
                        ClassId = classId,
                        StudentId = i
                    };
                    origin.ClassMembers.Add(classMember);
                    rs.Add(classMember);
                    newStudentIds.Add(i);
                }
                else if (found.Status == (int)ClassMemberEnums.STATUS_DISABLE)
                {
                    found.Status = (int)ClassMemberEnums.STATUS_ACTIVE;
                    rs.Add(found);
                    newStudentIds.Add(i);
                }
            });
            repository.Update(origin);
            //create new transcript
            var transcriptService = new TranscriptService();
            transcriptService.AddMultipleTranscript(newStudentIds, classId);
            return rs;
        }

        public IEnumerable<ClassMember> RemoveStudentFromClass(int classId, List<int> studentIds)
        {
            var rs = new List<ClassMember>();
            var origin = repository.Get(classId);
            var removedStudentIds = new List<int>();
            studentIds.ForEach(i =>
            {
                var found = origin.ClassMembers.Where(cm => cm.StudentId == i).FirstOrDefault();
                if (found != null && found.Status != (int)ClassMemberEnums.STATUS_DISABLE)
                {
                    found.Status = (int)ClassMemberEnums.STATUS_DISABLE;
                    rs.Add(found);
                    removedStudentIds.Add(i);
                }
            });
            repository.Update(origin);
            //remove transcript of student
            var transcriptService = new TranscriptService();
            transcriptService.DeleteMultipleTranscript(removedStudentIds, classId);
            return rs;
        }

        public IEnumerable<ClassSubject> AddSubjectToClass(int classId, List<ClassSubjectModel> subjectIds)
        {
            var origin = repository.Get(classId);
            var rs = new List<ClassSubject>();
            //add subject to class
            subjectIds.ForEach(i =>
            {
                var found = origin.ClassSubjects.Where(cs => cs.SubjectId == i.SubjectId).FirstOrDefault();
                if (found == null)
                {
                    var classSubject = new ClassSubject
                    {
                        Id = 0,
                        Status = (int)ClassSubjectEnums.STATUS_ACTIVE,
                        ClassId = classId,
                        SubjectId = i.SubjectId,
                        Teacher = i.TeacherId
                    };
                    origin.ClassSubjects.Add(classSubject);
                    rs.Add(classSubject);
                }
                else
                {
                    if(found.Status == (int)ClassSubjectEnums.STATUS_DISABLE)
                    {
                        rs.Add(found);
                    }
                    found.Status = (int)ClassSubjectEnums.STATUS_ACTIVE;
                    found.Teacher = i.TeacherId;
                }
            });
            repository.Update(origin);
            //update transcript of class
            var subjectRepository = new SubjectRepository();
            rs.ForEach(cs =>
            {
                cs.Subject = subjectRepository.Get(cs.SubjectId);
            });
            var transcriptService = new TranscriptService();
            transcriptService.AddSubjectToClassTranscript(classId, rs);
            return rs;
        }

        public IEnumerable<ClassSubject> RemoveSubjectFromClass(int classId, List<ClassSubjectModel> subjectIds)
        {
            var rs = new List<ClassSubject>();
            var origin = repository.Get(classId);
            //remove subject
            subjectIds.ForEach(i =>
            {
                var found = origin.ClassSubjects.Where(cs => cs.SubjectId == i.SubjectId).FirstOrDefault();
                if (found != null && found.Status != (int)ClassSubjectEnums.STATUS_DISABLE)
                {
                    found.Status = (int)ClassSubjectEnums.STATUS_DISABLE;
                    found.Teacher = null;
                    rs.Add(found);
                }
            });
            repository.Update(origin);
            //remove transcript of deleted subjects
            var transcriptService = new TranscriptService();
            transcriptService.DeleteSubjectFromTranscript(classId, rs);
            return rs;
        }

        public int GetTeacherCurrentClassQuantity(string teacherName)
        {
            return repository.GetTeacherCurrentClass(teacherName).Count();
        }

        public List<ClassSubject> GetTeacherCurrentClass(string teacherName)
        {
            return repository.GetTeacherCurrentClass(teacherName).ToList();
        }

        public List<Class> GetHomeroomClass(string teacherName)
        {
            return repository.GetHomeroomClass(teacherName).ToList();
        }
    }
}