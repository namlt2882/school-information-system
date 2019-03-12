using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class ExaminationRepository : BaseRepository<Examination>
    {
        public IEnumerable<Examination> GetAll()
        {
            var exams = DbContext.Examinations
                .Where(x => x.Status == (int)ExaminationEnums.STATUS_ACTIVE);
            return exams;
        }

    }
}