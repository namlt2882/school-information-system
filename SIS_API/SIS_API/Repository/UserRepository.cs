using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class UserRepository: BaseRepository<User>
    {
        public User Get(string username)
        {
            var user = DbContext.Users.Where(x => x.Status == 1).FirstOrDefault();
            return user;
        }
    }
}