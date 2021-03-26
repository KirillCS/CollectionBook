using Application.Collections.Commands.CreateCollection;
using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using WebUI.Interfaces;

namespace WebUI.Controllers
{
    public class CollectionController : ApiControllerBase
    {
        private readonly ICollectionCoverService collectionCoverService;
        private readonly IApplicationDbContext dbContext;

        public CollectionController(ICollectionCoverService collectionCoverService, IApplicationDbContext dbContext)
        {
            this.collectionCoverService = collectionCoverService;
            this.dbContext = dbContext;
        }

        [Route("create")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCollection([FromForm] CreateCollectionCommand command, IFormFile cover)
        {
            command.CoverPath = await collectionCoverService.SaveCover(cover);

            await Mediator.Send(command);

            return Ok();
        }
    }
}
