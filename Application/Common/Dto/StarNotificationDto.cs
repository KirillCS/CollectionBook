using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class StarNotificationDto : IMapFrom<Star>
    {
        public UserCoverDto User { get; set; }

        public CollectionNameDto Collection { get; set; }

        public int StarsCount { get; set; }

        void IMapFrom<Star>.Mapping(Profile profile)
        {
            profile.CreateMap<Star, StarNotificationDto>()
                   .ForMember(d => d.StarsCount, s => s.MapFrom(s => s.Collection.Stars.Count));
        }
    }
}
