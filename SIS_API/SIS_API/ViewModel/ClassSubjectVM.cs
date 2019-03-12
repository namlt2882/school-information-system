using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.ViewModel
{
    public class ClassSubjectVM:BaseVM<ClassSubject>
    {
        public int ClassId { get; set; }
        public IEnumerable<int> SubjectIds { get; set; }
    }
}