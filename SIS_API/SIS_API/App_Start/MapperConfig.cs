using AutoMapper;
using SIS_API.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.App_Start
{
    public class MapperConfig
    {   
        public static void Initialize()
        {
            Mapper.Initialize((config) =>
            {
                config.CreateMap<User, UserVM>().ReverseMap();
                config.CreateMap<User, TeacherVM>().ReverseMap();
                config.CreateMap<User, UserCM>().ReverseMap();

                config.CreateMap<Subject, SubjectVM>().ReverseMap();
                config.CreateMap<Examination, ExaminationVM>().ReverseMap();
                config.CreateMap<Student, StudentVM>().ReverseMap();

                config.CreateMap<Class, ClassVM>().ReverseMap();
                config.CreateMap<Class, ClassFM>().ReverseMap();
                config.CreateMap<Class, TeachingClassVM>().ReverseMap();

                config.CreateMap<AcademicTranscript, TranscriptVM>().ReverseMap();
            });
        }
    }
}