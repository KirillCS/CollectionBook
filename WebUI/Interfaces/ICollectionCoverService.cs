using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Interfaces
{
    public interface ICollectionCoverService
    {
        Task<string> SaveCover(IFormFile cover);
    }
}
