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
            var user = DbContext.Users.Where(x => x.Status == 1).FirstOrDefault();
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