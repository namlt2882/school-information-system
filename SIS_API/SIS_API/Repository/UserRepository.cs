using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class UserRepository : BaseRepository<User>
    {
        public IEnumerable<User> GetAll()
        {
            var users = from u in DbContext.Users
                        where u.Role != (int)UserEnums.ROLE_ADMIN && u.Status != (int)UserEnums.STATUS_DISABLE
                        select u;
            return users;
        }

        public User Get(string username)
        {
            var user = DbContext.Users.Where(x => x.Username == username && x.Status != (int)UserEnums.STATUS_DISABLE).FirstOrDefault();
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