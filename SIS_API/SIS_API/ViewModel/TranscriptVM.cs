using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.ViewModel
{
    public class TranscriptVM : BaseVM<AcademicTranscript>
    {
        public int Id { get; set; }
        public int ClassSubjectId { get; set; }
        public int StudentId { get; set; }
        public int ExamId { get; set; }
        public string SubjectName { get; set; }
        public string ExamName { get; set; }
        public int PercentRate { get; set; }
        public Nullable<double> Score { get; set; }
        public int Status { get; set; }
    }
}