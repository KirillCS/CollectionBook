using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class UserCardDto : UserCoverDto, IMapFrom<User>
    {
        public int CollectionsCount { get; set; }

        void IMapFrom<User>.Mapping(Profile profile)
        {
            profile.CreateMap<User, UserCardDto>().ForMember(d => d.Login, s => s.MapFrom(u => u.UserName))
                                                  .ForMember(d => d.CollectionsCount, s => s.MapFrom(u => u.Collections.Count));
        }
    }
}
