using Application.Stars.ToggleStar;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class StarController : ApiControllerBase
    {
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ToggleStar([FromBody] ToggleStarCommand command)
        {
            await Mediator.Send(command);

            return Ok();
        }
    }
}
