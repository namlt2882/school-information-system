using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Transactions;
using System.Web;

namespace SIS_API.Repository
{
    public class TranscriptRepository : BaseRepository<AcademicTranscript>
    {
        public IEnumerable<AcademicTranscript> GetTranscriptOfStudentInClass(int studentId, int classId)
        {
            //get class subject
            var cs = from c in DbContext.ClassSubjects
                     where c.ClassId == classId && c.Status != (int)ClassSubjectEnums.STATUS_DISABLE
                     select c;
            //get transcript
            var trans = from t in DbContext.AcademicTranscripts
                        join c in cs on t.ClassSubjectId equals c.Id
                        where t.StudentId == studentId && t.Status != (int)TranscriptEnums.STATUS_DISABLE
                        select t;
            return trans;
        }

        public IEnumerable<AcademicTranscript> GetTranscriptOfMultipleStudent(List<int> studentIds, int classId)
        {
            //get class subject
            var cs = from c in DbContext.ClassSubjects
                     where c.ClassId == classId && c.Status != (int)ClassSubjectEnums.STATUS_DISABLE
                     select c;
            //get transcript
            var trans = from t in DbContext.AcademicTranscripts
                        join c in cs on t.ClassSubjectId equals c.Id
                        where studentIds.Contains(t.StudentId) && t.Status != (int)TranscriptEnums.STATUS_DISABLE
                        select t;
            return trans;
        }

        public List<AcademicTranscript> GetTranscripts(List<int> transcriptIds)
        {
            var ats = from at in DbContext.AcademicTranscripts
                      where at.Status != (int)TranscriptEnums.STATUS_DISABLE && transcriptIds.Contains(at.Id)
                      select at;
            return ats.ToList();
        }

        public IEnumerable<AcademicTranscript> AddTranscripts(List<AcademicTranscript> list)
        {
            lock (DbContext)
            {
                var rs = new List<AcademicTranscript>();
                using (var transaction = DbContext.Database.BeginTransaction())
                {
                    try
                    {
                        foreach (AcademicTranscript at in list)
                        {
                            var tmp = DbContext.AcademicTranscripts.Add(at);
                            rs.Add(tmp);
                        }
                        DbContext.SaveChanges();
                        transaction.Commit();
                        foreach (AcademicTranscript at in list)
                        {
                            UpdateContext(at);
                        }
                    }
                    catch (Exception e)
                    {
                        transaction.Rollback();
                        throw e;
                    }
                }
                return rs;
            }
        }

        public List<AcademicTranscript> GetAllActiveTranscriptOfSubject(int subjectId)
        {
            // get all active class subjects of active classes
            var classSubjects = from cs in DbContext.ClassSubjects
                                where cs.SubjectId == subjectId
                                && cs.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                                && cs.Class.Status == (int)ClassEnums.STATUS_ACTIVE
                                select cs;
            // join with academic transcript table, select active records
            var trans = from t in DbContext.AcademicTranscripts
                        join cs in classSubjects on t.ClassSubjectId equals cs.Id
                        where t.Status == (int)TranscriptEnums.STATUS_ACTIVE
                        select t;
            return trans.ToList();
        }

        public List<AcademicTranscript> GetAllActiveTranscriptOfExam(int examId)
        {
            // get all active class subjects of active classes
            var classSubjects = from cs in DbContext.ClassSubjects
                                where cs.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                                && cs.Class.Status == (int)ClassEnums.STATUS_ACTIVE
                                select cs;
            // join with academic transcript table, select active records
            var trans = from t in DbContext.AcademicTranscripts
                        join cs in classSubjects on t.ClassSubjectId equals cs.Id
                        where t.Status == (int)TranscriptEnums.STATUS_ACTIVE
                        && t.ExamId == examId
                        select t;
            return trans.ToList();
        }

        public List<AcademicTranscript> GetTranscriptByStudentsAndClassSubjects(List<int> studentIds, List<int> classSubjectIds)
        {
            var trans = from t in DbContext.AcademicTranscripts
                        where studentIds.Contains(t.StudentId) && classSubjectIds.Contains(t.ClassSubjectId)
                        && t.Status != (int)TranscriptEnums.STATUS_DISABLE
                        select t;
            return trans.ToList();
        }

        public void UpdateTranscripts(List<AcademicTranscript> list)
        {
            lock (DbContext)
            {
                using (DbContext)
                {
                    using (var transaction = DbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            foreach (AcademicTranscript at in list)
                            {
                                DbContext.Entry(at).State = EntityState.Modified;
                            }
                            DbContext.SaveChanges();
                            transaction.Commit();
                            foreach (AcademicTranscript at in list)
                            {
                                UpdateContext(at);
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
        }

        public IEnumerable<AcademicTranscript> GetTranscriptOfClassSubject(int classSubjectId)
        {
            var rs = from tran in DbContext.AcademicTranscripts
                     where tran.Status == (int)TranscriptEnums.STATUS_ACTIVE
                     && tran.ClassSubjectId == classSubjectId
                     select tran;
            return rs;
        }

        public IEnumerable<AcademicTranscript> GetStudentCurrentTranscript(int studentId)
        {
            //get active class subject
            var cs = from c in DbContext.ClassSubjects
                     where c.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                     && c.Class.Status==(int)ClassEnums.STATUS_ACTIVE
                     select c;
            //get transcript of student
            var trans = from t in DbContext.AcademicTranscripts
                        join c in cs on t.ClassSubjectId equals c.Id
                        where t.StudentId == studentId 
                        && t.Status == (int)TranscriptEnums.STATUS_ACTIVE
                        select t;
            return trans;
        }

        public IEnumerable<AcademicTranscript> GetTranscriptsOfClass(int classId)
        {
            // get class subject of class
            var classSubjects = from cs in DbContext.ClassSubjects
                                where cs.ClassId == classId 
                                && cs.Status == (int)ClassSubjectEnums.STATUS_ACTIVE
                                select cs;
            // get transcript of class
            var transcripts = from tran in DbContext.AcademicTranscripts
                              join cs in classSubjects on tran.ClassSubjectId equals cs.Id
                              where tran.Status == (int)TranscriptEnums.STATUS_ACTIVE
                              select tran;
            return transcripts;
        }
    }
}