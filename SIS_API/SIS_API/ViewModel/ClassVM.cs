using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.ViewModel
{
    public class ClassVM : BaseVM<Class>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Manager { get; set; }
        public System.DateTime InsertDate { get; set; }
        public int Status { get; set; }
        public int SubjectQuantity { get; set; }
        public int StudentQuantity { get; set; }
    }

    public class ClassFM : ClassVM
    {
        [JsonProperty("HomeroomTeacher")]
        public virtual TeacherVM User { get; set; }
        public virtual ICollection<StudentVM> Students { get; set; }
        public virtual ICollection<SubjectVM> Subjects { get; set; }
    }
}