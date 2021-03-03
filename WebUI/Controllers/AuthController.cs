﻿using Application.Auth.Commands.Login;
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
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            return Ok(new { accessToken = await Mediator.Send(command) });
        }

        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        {
            return Ok(new { accessToken = await Mediator.Send(command) });
        }
    }
}
