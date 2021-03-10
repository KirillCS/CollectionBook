using Application.Users.Queries.GetProfile;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class UserController : ApiControllerBase
    {
        [Route("profile/{Login}")]
        [HttpGet]
        public async Task<IActionResult> GetProfile([FromRoute]GetProfileQuery query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
