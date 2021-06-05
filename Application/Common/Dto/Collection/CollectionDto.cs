using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;

namespace Application.Common.Dto
{
    public class CollectionDto : IMapFrom<Collection>, IMapFrom<Star>
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
                   .ForMember(dto => dto.CreationTime, s => s.MapFrom(c => DateTime.SpecifyKind(c.CreationTime, DateTimeKind.Utc)))
                   .ForMember(dto => dto.User, s => s.MapFrom(c => c.User))
                   .ForMember(dto => dto.Tags, s => s.MapFrom(c => c.Tags))
                   .ForMember(dto => dto.Stars, s => s.MapFrom(c => c.Stars));
        }

        void IMapFrom<Star>.Mapping(Profile profile)
        {
            profile.CreateMap<Star, CollectionDto>()
                   .ForMember(dto => dto.Id, s => s.MapFrom(s => s.Collection.Id))
                   .ForMember(dto => dto.Name, s => s.MapFrom(s => s.Collection.Name))
                   .ForMember(dto => dto.Description, s => s.MapFrom(s => s.Collection.Description))
                   .ForMember(dto => dto.CoverPath, s => s.MapFrom(s => s.Collection.CoverPath))
                   .ForMember(dto => dto.CreationTime, s => s.MapFrom(s => DateTime.SpecifyKind(s.Collection.CreationTime, DateTimeKind.Utc)))
                   .ForMember(dto => dto.User, s => s.MapFrom(s => s.Collection.User))
                   .ForMember(dto => dto.ItemsCount, s => s.MapFrom(s => s.Collection.Items.Count))
                   .ForMember(dto => dto.Stars, s => s.MapFrom(s => s.Collection.Stars))
                   .ForMember(dto => dto.Tags, s => s.MapFrom(s => s.Collection.Tags));
        }
    }
}
