using SIS_API.Repository;
using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Service
{
    public class UserService
    {
        UserRepository repository = new UserRepository();
        public User InsertUser(User user)
        {
            user.Status = (int)UserEnums.STATUS_ACTIVE;
            user.Role = (int)UserEnums.ROLE_TEACHER;
            return repository.Insert(user);
        }

        public IEnumerable<User> GetAll()
        {
            return repository.GetAll();
        }

        public User GetByUsername(string username)
        {
            return repository.Get(username);
        }

        public void Update(User user)
        {
            User origin = repository.Get(user.Username);
            origin.Password = user.Password;
            origin.Name = user.Name;
            origin.SubjectId = user.SubjectId;
            repository.Update(origin);
        }

        public void Delete(string username)
        {
            User origin = repository.Get(username);
            origin.Status = (int)UserEnums.STATUS_DISABLE;
            repository.Update(origin);
        }
        
    }
}