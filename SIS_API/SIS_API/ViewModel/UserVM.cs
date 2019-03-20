using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.ViewModel
{
    public class UserVM : BaseVM<User>
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public int Role { get; set; }
        public int Status { get; set; }
    }

    public class TeacherVM : BaseVM<User>
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public Nullable<int> SubjectId { get; set; }
        public IEnumerable<ClassVM> HomeroomClass { get; set; } = new List<ClassVM>();
        public int TeachingClassQuantity { get; set; }
    }

    public class UserCM : BaseVM<User>
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public Nullable<int> SubjectId { get; set; }
    }
}