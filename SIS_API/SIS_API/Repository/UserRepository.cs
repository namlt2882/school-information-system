using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class UserRepository : BaseRepository<User>
    {
        public User Get(string username)
        {
            var user = DbContext.Users.Where(x => x.Username == username && x.Status == (int)UserEnums.STATUS_ACTIVE).FirstOrDefault();
            return user;
        }
        public User GetByUsernameAndPassword(string username, string password)
        {
            var user = DbContext.Users
                .Where(x => x.Username == username && x.Password == password)
                .FirstOrDefault();
            return user;
        }
    }
}