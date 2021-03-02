﻿using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class JwtService : IJwtService
    {
        private readonly IOptions<AuthOptions> authOptions;
        private readonly IUserService userService;

        public JwtService(IOptions<AuthOptions> authOptions, IUserService userService)
        {
            this.authOptions = authOptions;
            this.userService = userService;
        }

        public async Task<string> GenerateJwt(User user)
        {
            var authParams = authOptions.Value;
            var credentials = new SigningCredentials(authParams.SymmetricSecurityKey, SecurityAlgorithms.HmacSha256);
            var claims = await GetUserClaims(user);
            var token = new JwtSecurityToken(issuer: authParams.Issuer,
                                             audience: authParams.Audience,
                                             claims: claims,
                                             expires: DateTime.Now.AddSeconds(authParams.TokenLifetime),
                                             signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<IEnumerable<Claim>> GetUserClaims(User user)
        {
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            var rolesClaim = (await userService.GetUserRoles(user)).Select(c => new Claim("role", c));
            claims.AddRange(rolesClaim);

            return claims;
        }
    }
}
