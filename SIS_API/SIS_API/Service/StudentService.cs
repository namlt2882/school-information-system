using SIS_API.Repository;
using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Service
{
    public class StudentService
    {
        StudentRepository repository = new StudentRepository();
        TranscriptRepository transcriptRepository = new TranscriptRepository();
        ClassRepository classRepository = new ClassRepository();
        public IEnumerable<Student> GetAllActive()
        {
            return repository.GetAll();
        }

        public IEnumerable<Student> GetAllGraduated()
        {
            return repository.GetGraduatedStudents();
        }

        public Student Add(Student student)
        {
            student.Id = 0;
            student.Status = (int)StudentEnums.STATUS_ACTIVE;
            student.InsertDate = DateTime.Now;
            return repository.Insert(student);
        }
        public Student Get(int id)
        {
            var rs = repository.Get(id);
            if (rs != null && rs.Status == (int)StudentEnums.STATUS_DISABLE)
            {
                rs = null;
            }
            return rs;
        }
        public void Update(Student student)
        {
            var origin = repository.Get(student.Id);
            origin.FirstName = student.FirstName;
            origin.LastName = student.LastName;
            origin.Birthday = student.Birthday;
            repository.Update(origin);
        }

        public void Delete(int id)
        {
            var origin = repository.Get(id);
            origin.Status = (int)StudentEnums.STATUS_DISABLE;
            repository.Update(origin);
            RemoveAllCurrentClassRelation(id);
        }

        public void SetGraduated(int id)
        {
            var origin = repository.Get(id);
            origin.Status = (int)StudentEnums.STATUS_GRADUATED;
            repository.Update(origin);
            RemoveAllCurrentClassRelation(id);
        }

        public void RemoveAllCurrentClassRelation(int studentId)
        {
            // remove class member
            var classMembers = classRepository.GetStudentCurrentClassMember(studentId).ToList();
            classMembers.ForEach(cm =>
            {
                cm.Status = (int)ClassMemberEnums.STATUS_DISABLE;
            });
            classRepository.UpdateClassMembers(classMembers);
            // remove transcript
            var transcripts = transcriptRepository.GetStudentCurrentTranscript(studentId).ToList();
            transcripts.ForEach(t =>
            {
                t.Status = (int)TranscriptEnums.STATUS_DISABLE;
            });
            transcriptRepository.UpdateTranscripts(transcripts);
        }

        public IEnumerable<Student> GetNoClassStudent()
        {
            return repository.GetNoClassStudent();
        }
    }
}