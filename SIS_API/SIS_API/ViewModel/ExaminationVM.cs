using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.ViewModel
{
    public class ExaminationVM : BaseVM<Examination>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PercentRate { get; set; }
    }
}