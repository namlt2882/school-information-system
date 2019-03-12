using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.Utility
{
    public enum UserEnums
    {
        ROLE_ADMIN = 1,
        ROLE_TEACHER = 2,
        STATUS_ACTIVE = 1,
        STATUS_DISABLE = 0
    }

    public enum SubjectEnums
    {
        STATUS_ACTIVE = 1,
        STATUS_DISABLE = 0
    }

    public enum ClassEnums
    {
        STATUS_ACTIVE = 1,
        STATUS_DISABLE = 0
    }

    public enum ExaminationEnums
    {
        STATUS_ACTIVE = 1,
        STATUS_DISABLE = 0
    }
    public enum StudentEnums
    {
        STATUS_ACTIVE = 1,
        STATUS_DISABLE = 0,
        STATUS_GRADUATED = 2
    }
}