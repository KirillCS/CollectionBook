using Application.Common.Dto;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Collections.Commands.ChangeCollectionTags
{
    public class ChangeCollectionTagsCommand : IRequest<IEnumerable<TagDto>>
    {
        private IEnumerable<string> tags = Array.Empty<string>();

        public int Id { get; set; }

        public IEnumerable<string> Tags
        {
            get => tags;
            set
            {
                if (value is not null)
                {
                    tags = value;
                }
            }
        }
    }

    public class ChangeCollectionTagsCommandHandler : IRequestHandler<ChangeCollectionTagsCommand, IEnumerable<TagDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;
        private readonly ITagService tagService;
        private readonly IMapper mapper;

        public ChangeCollectionTagsCommandHandler(IApplicationDbContext context,
                                                  ICurrentUserService currentUserService,
                                                  ITagService tagService,
                                                  IMapper mapper)
        {
            this.context = context;
            this.currentUserService = currentUserService;
            this.tagService = tagService;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<TagDto>> Handle(ChangeCollectionTagsCommand request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections.Include(c => c.Tags).FirstOrDefaultAsync(c => c.Id == request.Id);
            Guard.Requires(() => collection is not null, new EntityNotFoundException());

            Guard.Requires(() => collection.UserId == currentUserService.Id, new OperationException(403));

            IEnumerable<Tag> tags = await tagService.Add(request.Tags);

            collection.Tags.Clear();
            collection.Tags.AddRange(tags);
            await context.SaveChanges(cancellationToken);

            return tags.Select(t => mapper.Map<TagDto>(t));
        }
    }
}
