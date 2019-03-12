using SIS_API.Service;
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
    public class TranscriptController : ApiController
    {
        TranscriptService service = new TranscriptService();
        [HttpGet]
        [Route("api/Transcript")]
        public IEnumerable<TranscriptVM> GetStudentTranscript(int StudentId, int ClassId)
        {
            var transcripts = service.GetTranscript(StudentId, ClassId);
            return transcripts.Select(t => BaseVM<object>.ToModel<TranscriptVM>(t));
        }

        [HttpPut]
        [Route("api/Transcript")]
        public void UpdateTranscripts(List<TranscriptVM> transcripts)
        {
            service.UpdateTranscripts(transcripts.Select(tv => tv.ToEntity()).ToList());
        }
    }
    
}
