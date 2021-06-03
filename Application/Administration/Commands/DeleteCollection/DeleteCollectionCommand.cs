using Application.Common.Attributes;
using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Administration.Commands.DeleteCollection
{
    [Authorize(new[] { Roles.Admin, Roles.Owner })]
    public class DeleteCollectionCommand : IRequest
    {
        public int Id { get; init; }

        public string Reason { get; init; }
    }

    public class DeleteCollectionCommandHandler : IRequestHandler<DeleteCollectionCommand>
    {
        private readonly IApplicationDbContext context;
        private readonly IEmailMessageExtensionsService service;
        private readonly IEmailSenderService emailSenderService;

        public DeleteCollectionCommandHandler(IApplicationDbContext context, IEmailMessageExtensionsService service, IEmailSenderService emailSenderService)
        {
            this.context = context;
            this.service = service;
            this.emailSenderService = emailSenderService;
        }

        public async Task<Unit> Handle(DeleteCollectionCommand request, CancellationToken cancellationToken)
        {
            Collection collection = await context.Collections.Include(c => c.User).FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
            if (collection is not null)
            {
                MimeMessage message = service.GenerateCollectionDeletionMessage(collection.User.Email, collection.Name, request.Reason);
                await emailSenderService.SendEmail(message);

                context.Collections.Remove(collection);
                await context.SaveChanges(cancellationToken);
            }

            return Unit.Value;
        }
    }
}
