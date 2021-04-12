using Application.Common.Interfaces;
using Application.Common.Mappings;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.CreateCollection
{
    public class CreateCollectionCommand : IRequest, IMapTo<Collection>
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public IFormFile Cover { get; set; }

        public IEnumerable<string> Tags { get; set; } = new List<string>();

        public void Mapping(Profile profile)
        {
            profile.CreateMap<CreateCollectionCommand, Collection>()
                   .ForMember(c => c.Tags, opt => opt.Ignore())
                   .ForMember(c => c.CoverPath, opt => opt.Ignore());
        }
    }

    public class CreateCollectionCommandHandler : IRequestHandler<CreateCollectionCommand>
    {
        private readonly ICollectionCoverService coverService;
        private readonly ITagService tagService;
        private readonly IMapper mapper;
        private readonly ICurrentUserService currentUserService;
        private readonly IApplicationDbContext dbContext;

        public CreateCollectionCommandHandler(ICollectionCoverService coverService,
                                              ITagService tagService,
                                              IMapper mapper,
                                              ICurrentUserService currentUserService,
                                              IApplicationDbContext dbContext)
        {
            this.coverService = coverService;
            this.tagService = tagService;
            this.mapper = mapper;
            this.currentUserService = currentUserService;
            this.dbContext = dbContext;
        }

        public async Task<Unit> Handle(CreateCollectionCommand request, CancellationToken cancellationToken)
        {
            string coverPath = null;
            if (request.Cover is not null)
            {
                coverPath = await coverService.Save(request.Cover);
            }

            IEnumerable<Tag> tags = await tagService.Add(request.Tags);

            Collection collection = mapper.Map<Collection>(request);
            collection.Tags.AddRange(tags);
            collection.CoverPath = coverPath;
            collection.UserId = currentUserService.Id;

            dbContext.Collections.Add(collection);
            await dbContext.SaveChanges(cancellationToken);

            return Unit.Value;
        }
    }
}
