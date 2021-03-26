using Application.Collections.Commands.CreateCollection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebUI.Interfaces;

namespace WebUI.Controllers
{
    public class CollectionController : ApiControllerBase
    {
        private readonly ICollectionCoverService collectionCoverService;

        public CollectionController(ICollectionCoverService collectionCoverService)
        {
            this.collectionCoverService = collectionCoverService;
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
