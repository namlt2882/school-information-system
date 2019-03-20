using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.ViewModel
{
    public class SubjectVM : BaseVM<Subject>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public UserVM Teacher { get; set; }
    }
}