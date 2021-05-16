using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;

namespace Application.Common.Dto
{
    public class CollectionDto : IMapFrom<Collection>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string CoverPath { get; set; }

        public DateTime CreationTime { get; set; }

        public UserCoverDto User { get; set; }

        public int ItemsCount { get; set; }

        public List<StarDto> Stars { get; set; }

        public List<TagDto> Tags { get; set; }

        void IMapFrom<Collection>.Mapping(Profile profile)
        {
            profile.CreateMap<Collection, CollectionDto>()
                   .ForMember(dto => dto.User, s => s.MapFrom(c => c.User))
                   .ForMember(dto => dto.Tags, s => s.MapFrom(c => c.Tags))
                   .ForMember(dto => dto.Stars, s => s.MapFrom(c => c.Stars));
        }
    }
}
