using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class ClassRepository : BaseRepository<Class>
    {

        public IEnumerable<Class> GetAll()
        {
            var classess = DbContext.Classes
                .Where(x => x.Status == (int)ClassEnums.STATUS_ACTIVE);
            return classess;
        }

        public Class GetClassessOfHomeromeTeacher(int id, string teacher)
        {
            var clazz = DbContext.Classes.Where(x => x.Id == id && x.Manager == teacher && x.Status == (int)ClassEnums.STATUS_ACTIVE).FirstOrDefault();
            return clazz;
        }

    }
}