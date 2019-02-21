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
}