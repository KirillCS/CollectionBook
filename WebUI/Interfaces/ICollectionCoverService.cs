using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace WebUI.Interfaces
{
    public interface ICollectionCoverService
    {
        Task<string> SaveCover(IFormFile cover);
    }
}
