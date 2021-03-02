using Application.Auth.Commands.Login;
using Application.Auth.Commands.Register;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ApiControllerBase
    {
        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromForm] LoginCommand command)
        {
            return Ok(new { access_token = await Mediator.Send(command) });
        }

        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}
