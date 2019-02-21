using SIS_API.Repository;
using SIS_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Service
{
    public class AuthenticationService
    {
        UserRepository repository = new UserRepository();
        public UserVM Login(string username, string password)
        {
            User user = repository.GetByUsernameAndPassword(username, password);
            if (user != null) {
                return BaseVM<object>.ToModel<UserVM>(user);
            }
            else
            {
                return null;
            }
        }
    }
}