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
            });
        }
    }
}