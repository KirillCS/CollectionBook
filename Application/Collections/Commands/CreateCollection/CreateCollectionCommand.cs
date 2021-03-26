using Application.Common.Interfaces;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.CreateCollection
{
    public class CreateCollectionCommand : IRequest, IMapTo<Collection>
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string CoverPath { get; set; }

        public IEnumerable<string> Tags { get; set; } = new List<string>();

        public void Mapping(Profile profile)
        {
            profile.CreateMap<CreateCollectionCommand, Collection>().ForMember(c => c.Tags, opt => opt.Ignore());
        }
    }

    public class CreateCollectionCommandHandler : IRequestHandler<CreateCollectionCommand>
    {
        private readonly ITagService tagService;
        private readonly IMapper mapper;
        private readonly ICurrentUserService currentUserService;
        private readonly IApplicationDbContext dbContext;

        public CreateCollectionCommandHandler(ITagService tagService,
                                              IMapper mapper,
                                              ICurrentUserService currentUserService,
                                              IApplicationDbContext dbContext)
        {
            this.tagService = tagService;
            this.mapper = mapper;
            this.currentUserService = currentUserService;
            this.dbContext = dbContext;
        }

        public async Task<Unit> Handle(CreateCollectionCommand request, CancellationToken cancellationToken)
        {
            var tags = await tagService.AddTags(request.Tags);
            var collection = mapper.Map<Collection>(request);
            collection.Tags.AddRange(tags);
            collection.UserId = currentUserService.UserId;

            dbContext.Collections.Add(collection);
            await dbContext.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}
