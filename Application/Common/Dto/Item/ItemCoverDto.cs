using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using System;
using System.Linq;

namespace Application.Common.Dto
{
    public class ItemCoverDto : IMapFrom<Item>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Info { get; set; }

        public DateTime CreationTime { get; set; }

        public string ImagePath { get; set; }

        void IMapFrom<Item>.Mapping(Profile profile)
        {
            profile.CreateMap<Item, ItemCoverDto>()
                   .ForMember(d => d.Info, s => s.MapFrom(i => i.Information))
                   .ForMember(d => d.CreationTime, s => s.MapFrom(i => DateTime.SpecifyKind(i.CreationTime, DateTimeKind.Utc)))
                   .ForMember(d => d.ImagePath, s => s.MapFrom(i => i.Images.Count > 0 ? i.Images.First().Path : null));
        }
    }
}
