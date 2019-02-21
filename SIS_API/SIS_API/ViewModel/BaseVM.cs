using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SIS_API.ViewModel
{
    public class BaseVM<T>
    {
        protected Type SelfType { get; set; }

        protected Type EntityType { get; set; }

        public BaseVM()
        {
            this.SelfType = base.GetType();
            this.EntityType = typeof(T);
        }
        public virtual void CopyFromEntity(T entity)
        {
            Mapper.Map((object)entity, (object)this, this.EntityType, this.SelfType);
        }

        public virtual void CopyToEntity(T entity)
        {
            Mapper.Map((object)this, (object)entity, this.SelfType, this.EntityType);
        }
        public T ToEntity()
        {
            T val = (T)Activator.CreateInstance(typeof(T));
            this.CopyToEntity(val);
            return val;
        }
        public static M ToModel<M>(object Entity)
        {
            M val = (M)Activator.CreateInstance(typeof(M));
            Mapper.Map((object)Entity, (object)val, Entity.GetType(), typeof(M));
            return val;
        }
    }
}