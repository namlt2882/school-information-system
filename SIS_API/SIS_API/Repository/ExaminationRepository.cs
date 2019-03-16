using SIS_API.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Repository
{
    public class ExaminationRepository : BaseRepository<Examination>
    {
        public List<Examination> GetAll()
        {
            var exams = DbContext.Examinations
                .Where(x => x.Status != (int)ExaminationEnums.STATUS_DISABLE);
            return exams.ToList();
        }

        public List<Examination> GetInList(List<int> ids)
        {
            var exams = DbContext.Examinations
                .Where(x => ids.Contains(x.Id) && x.Status != (int)ExaminationEnums.STATUS_DISABLE);
            return exams.ToList();
        }

    }
}