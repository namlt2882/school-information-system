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
        ClassRepository classRepository = new ClassRepository();
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
            origin.Name = user.Name;
            origin.SubjectId = user.SubjectId;
            repository.Update(origin);
        }

        public void SetPassword(string username, string newPassword)
        {
            User origin = repository.Get(username);
            origin.Password = newPassword;
            repository.Update(origin);
        }

        public void Delete(string username)
        {
            User origin = repository.Get(username);
            origin.Status = (int)UserEnums.STATUS_DISABLE;
            repository.Update(origin);
            RemoveTeacherFromCurrentClass(username);
        }

        public void Ban(string username)
        {
            User origin = repository.Get(username);
            origin.Status = (int)UserEnums.STATUS_BANNED;
            repository.Update(origin);
            RemoveTeacherFromCurrentClass(username);
        }

        public void Activate(string username)
        {
            User origin = repository.Get(username);
            origin.Status = (int)UserEnums.STATUS_ACTIVE;
            repository.Update(origin);
        }

        public void RemoveTeacherFromCurrentClass(string teacher)
        {
            //update home room class
            var homeroomClasses = classRepository.GetHomeroomClass(teacher).ToList();
            homeroomClasses = homeroomClasses.Select(hc =>
             {
                 hc.Manager = null;
                 return hc;
             }).ToList();
            classRepository.UpdateClassess(homeroomClasses);
            //update class subject
            var classSubjects = classRepository.GetTeachingClass(teacher).ToList();
            classSubjects = classSubjects.Select(c =>
            {
                c.Teacher = null;
                return c;
            }).ToList();
            classRepository.UpdateClassSubjects(classSubjects);
        }

    }
}