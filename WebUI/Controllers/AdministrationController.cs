using Application.Administration.Commands.ToggleUserRole;
using Application.Administration.Queries.GetDashboardUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    [Route("api/admin")]
    public class AdministrationController : ApiControllerBase
    {
        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetDashboardUsers([FromQuery] GetDashboardUsersQuery query) =>
            Ok(await Mediator.Send(query));

        [Authorize]
        [HttpPost("role")]
        public async Task<IActionResult> ToggleUserRole([FromBody] ToggleUserRoleCommand command) =>
            Ok(await Mediator.Send(command));
    }
}
