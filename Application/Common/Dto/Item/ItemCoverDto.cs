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
                   .ForMember(d => d.Info, o => o.MapFrom(s => s.Information))
                   .ForMember(d => d.ImagePath, o => o.MapFrom(s => s.Images.Count > 0 ? s.Images.First().Path : null));
        }
    }
}
