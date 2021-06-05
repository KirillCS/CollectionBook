using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;

namespace Application.Common.Dto
{
    public class ItemDto : IMapFrom<Item>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Information { get; set; }

        public IEnumerable<TagDto> Tags { get; set; }

        public IEnumerable<ImageDto> Images { get; set; }

        public DateTime CreationTime { get; set; }

        public CollectionNameDto Collection { get; set; }

        public UserLoginDto User { get; set; }

        void IMapFrom<Item>.Mapping(Profile profile) =>
            profile.CreateMap<Item, ItemDto>()
                   .ForMember(d => d.CreationTime, s => s.MapFrom(i => DateTime.SpecifyKind(i.CreationTime, DateTimeKind.Utc)));
    }
}
