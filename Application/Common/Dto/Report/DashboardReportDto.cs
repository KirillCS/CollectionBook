using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using System;

namespace Application.Common.Dto
{
    public class DashboardReportDto : IMapFrom<Report>
    {
        public int Id { get; set; }

        public DateTime CreationTime { get; set; }

        public string Description { get; set; }

        public int CollectionId { get; set; }

        public string CollectionName { get; set; }

        public string UserLogin { get; set; }

        void IMapFrom<Report>.Mapping(Profile profile) =>
            profile.CreateMap<Report, DashboardReportDto>()
                   .ForMember(d => d.CreationTime, s => s.MapFrom(r => DateTime.SpecifyKind(r.CreationTime, DateTimeKind.Utc)))
                   .ForMember(d => d.CollectionName, s => s.MapFrom(r => r.Collection.Name))
                   .ForMember(d => d.UserLogin, s => s.MapFrom(r => r.User.UserName));
    }
}
