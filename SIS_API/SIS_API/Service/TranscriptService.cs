using SIS_API.Repository;
using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Service
{
    public class TranscriptService
    {
        TranscriptRepository repository = new TranscriptRepository();
        ExaminationRepository examRepository = new ExaminationRepository();
        ClassRepository classRepository = new ClassRepository();
        StudentRepository studentRepository = new StudentRepository();
        public IEnumerable<AcademicTranscript> AddMultipleTranscript(List<int> studentIds, int classId)
        {
            var exams = examRepository.GetAll();
            var classSubjects = classRepository.GetSubjectOfClass(classId);
            var rs = new List<AcademicTranscript>();
            foreach (int StudentId in studentIds)
            {
                foreach (ClassSubject cs in classSubjects)
                {
                    foreach (Examination ex in exams)
                    {
                        var tmp = new AcademicTranscript
                        {
                            Id = 0,
                            Status = (int)TranscriptEnums.STATUS_ACTIVE,
                            Score = null,
                            StudentId = StudentId,
                            ExamId = ex.Id,
                            ClassSubjectId = cs.Id,
                            SubjectName = cs.Subject.Name,
                            ExamName = ex.Name,
                            PercentRate = ex.PercentRate
                        };
                        rs.Add(tmp);
                    }
                }
            }
            return repository.AddTranscripts(rs);
        }
        public IEnumerable<AcademicTranscript> AddSubjectToClassTranscript(int classId, List<ClassSubject> classSubjects)
        {
            var studentIds = classRepository.GetAllClassMember(classId).Select(cm => cm.StudentId);
            var exams = examRepository.GetAll();
            var rs = new List<AcademicTranscript>();
            foreach (int StudentId in studentIds)
            {
                foreach (ClassSubject cs in classSubjects)
                {
                    foreach (Examination ex in exams)
                    {
                        var tmp = new AcademicTranscript
                        {
                            Id = 0,
                            Status = (int)TranscriptEnums.STATUS_ACTIVE,
                            Score = null,
                            StudentId = StudentId,
                            ExamId = ex.Id,
                            ClassSubjectId = cs.Id,
                            SubjectName = cs.Subject.Name,
                            ExamName = ex.Name,
                            PercentRate = ex.PercentRate
                        };
                        rs.Add(tmp);
                    }
                }
            }
            return repository.AddTranscripts(rs);
        }

        public void DeleteSubjectFromTranscript(int classId, List<ClassSubject> classSubjects)
        {
            var students = studentRepository.GetStudentOfClass(classId);
            var origins = repository
                .GetTranscriptByStudentsAndClassSubjects(students.Select(s => s.Id).ToList(),
                classSubjects.Select(cs => cs.Id).ToList());
            origins.ForEach(at =>
            {
                at.Status = (int)TranscriptEnums.STATUS_DISABLE;
            });
            repository.UpdateTranscripts(origins);
        }
        public IEnumerable<AcademicTranscript> GetTranscript(int studentId, int classId)
        {
            return repository.GetTranscriptOfStudentInClass(studentId, classId);
        }

        public void UpdateTranscripts(List<AcademicTranscript> transcripts)
        {
            var ids = transcripts.Select(t => t.Id).ToList();
            var origins = repository.GetTranscripts(ids);
            if (origins.Count != transcripts.Count)
            {
                throw new Exception("Wrong infomation of transcript");
            }
            Dictionary<int, AcademicTranscript> originMap = new Dictionary<int, AcademicTranscript>();
            origins.ForEach(at => originMap.Add(at.Id, at));
            transcripts.ForEach(at =>
            {
                AcademicTranscript origin = null;
                if(originMap.TryGetValue(at.Id, out origin))
                {
                    origin.Score = at.Score;
                }
                else
                {
                    throw new Exception("Not found a specific row of transcript");
                }
            });
            repository.UpdateTranscripts(origins);
        }

        public void DeleteMultipleTranscript(List<int> studentIds, int classId)
        {
            var transcripts = repository.GetTranscriptOfMultipleStudent(studentIds, classId);
            foreach (AcademicTranscript at in transcripts)
            {
                at.Status = (int)TranscriptEnums.STATUS_DISABLE;
            }
            repository.UpdateTranscripts(transcripts.ToList());
        }

        public void ReserveMultipleTranscript(List<int> studentIds, int classId)
        {
            var transcripts = repository.GetTranscriptOfMultipleStudent(studentIds, classId);
            foreach (AcademicTranscript at in transcripts)
            {
                at.Status = (int)TranscriptEnums.STATUS_RESERVE;
            }
            repository.UpdateTranscripts(transcripts.ToList());
        }

        public IEnumerable<AcademicTranscript> GetTranscriptOfClassSubject(int classSubjectId)
        {
            return repository.GetTranscriptOfClassSubject(classSubjectId);
        }

    }
}