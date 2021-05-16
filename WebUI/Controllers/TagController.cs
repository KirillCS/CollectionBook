using Application.Tags.Query.FindTags;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class TagController : ApiControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> FindTags([FromQuery] FindTagsQuery query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
