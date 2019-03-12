using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class BaseRepository<T> where T : class
    {
        public static SchoolInformationSystemEntities DbContext = new SchoolInformationSystemEntities();
        DbSet entities;

        public BaseRepository()
        {
            lock (DbContext)
            {
                DbContext = new SchoolInformationSystemEntities();
            }
            Type generic = typeof(T);
            if (generic == typeof(User))
            {
                entities = DbContext.Users;
            }
            else if (generic == typeof(Student))
            {
                entities = DbContext.Students;
            }
            else if (generic == typeof(Subject))
            {
                entities = DbContext.Subjects;
            }
            else if (generic == typeof(Class))
            {
                entities = DbContext.Classes;
            }
            else if (generic == typeof(ClassSubject))
            {
                entities = DbContext.ClassSubjects;
            }
            else if (generic == typeof(AcademicTranscript))
            {
                entities = DbContext.AcademicTranscripts;
            }
            else if (generic == typeof(ClassMember))
            {
                entities = DbContext.ClassMembers;
            }
            else if (generic == typeof(Examination))
            {
                entities = DbContext.Examinations;
            }
        }

        public T Insert(T t)
        {
            lock (DbContext)
            {
                object result = entities.Add(t);
                DbContext.SaveChanges();
                return (T)result;
            }
        }

        public void Update(object t)
        {
            lock (DbContext)
            {
                DbContext.Entry(t).State = EntityState.Modified;
                DbContext.SaveChanges();
            }
        }

        public T Get(object id)
        {
            return (T)entities.Find(id);
        }

        public IEnumerable<T> GetAll()
        {
            Type type = typeof(T);
            return (from r in entities.Cast<T>() select r);
        }

    }
}