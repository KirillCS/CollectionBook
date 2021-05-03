using Application.Items.Commands.CreateItem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class ItemController : ApiControllerBase
    {
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateItem([FromBody] CreateItemCommand command) =>
            Ok(await Mediator.Send(command));
    }
}
