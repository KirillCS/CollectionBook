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

namespace Application.Items.Commands.ChangeItemTags
{
    public class ChangeItemTagsCommand : IRequest<IEnumerable<TagDto>>
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

    public class ChangeItemTagsCommandHandler : IRequestHandler<ChangeItemTagsCommand, IEnumerable<TagDto>>
    {
        private readonly IApplicationDbContext context;
        private readonly ICurrentUserService currentUserService;
        private readonly ITagService tagService;
        private readonly IMapper mapper;

        public ChangeItemTagsCommandHandler(IApplicationDbContext context,
                                                  ICurrentUserService currentUserService,
                                                  ITagService tagService,
                                                  IMapper mapper)
        {
            this.context = context;
            this.currentUserService = currentUserService;
            this.tagService = tagService;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<TagDto>> Handle(ChangeItemTagsCommand request, CancellationToken cancellationToken)
        {
            Item item = await context.Items.Include(i => i.Collection).Include(i => i.Tags).FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);
            Guard.Requires(() => item is not null, new EntityNotFoundException());

            string userId = currentUserService.Id;
            Guard.Requires(() => userId == item.Collection.UserId, new OperationException(403));

            IEnumerable<Tag> tags = await tagService.Add(request.Tags);

            item.Tags.Clear();
            item.Tags.AddRange(tags);
            await context.SaveChanges(cancellationToken);

            return tags.Select(t => mapper.Map<TagDto>(t));
        }
    }
}
