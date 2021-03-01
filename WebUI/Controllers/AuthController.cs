﻿using Application.Auth.Login;
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
        public async Task<IActionResult> Login([FromBody]LoginCommand command)
        {
            return Ok(await Mediator.Send(command));
        }
    }
}