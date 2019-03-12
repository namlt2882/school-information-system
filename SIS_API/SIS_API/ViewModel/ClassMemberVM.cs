using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.ViewModel
{
    public class ClassMemberVM : BaseVM<ClassMember>
    {
        public int ClassId { get; set; }
        public IEnumerable<int> StudentIds { get; set; }
    }
}