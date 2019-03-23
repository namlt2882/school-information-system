using SIS_API.Repository;
using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Service
{
    public class SubjectService
    {
        SubjectRepository repository = new SubjectRepository();
        TranscriptRepository transcriptRepository = new TranscriptRepository();
        public Subject Add(Subject subject)
        {
            subject.Id = 0;
            subject.Status = (int)SubjectEnums.STATUS_ACTIVE;
            var rs = repository.Insert(subject);
            return rs;
        }

        public IEnumerable<Subject> GetAll()
        {
            return repository.GetAll();
        }

        public Subject Get(int id)
        {
            var rs = repository.Get(id);
            if (rs != null && rs.Status == (int)SubjectEnums.STATUS_DISABLE)
            {
                rs = null;
            }
            return rs;
        }

        public void Update(Subject subject)
        {
            var origin = repository.Get(subject.Id);
            origin.Name = subject.Name;
            repository.Update(origin);
            // update active transcripts
            var transcripts = transcriptRepository.GetAllActiveTranscriptOfSubject(subject.Id);
            transcripts.ForEach(t =>
            {
                t.SubjectName = subject.Name;
            });
            transcriptRepository.UpdateTranscripts(transcripts);
        }

        public void Delete(int id)
        {
            var origin = repository.Get(id);
            origin.Status = (int)SubjectEnums.STATUS_DISABLE;
            repository.Update(origin);
        }

    }
}