using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace WebUI.Interfaces
{
    public interface IFormFileSaver
    {
        Task<string> SaveAvatar(IFormFile avatar, string fileName);

        Task<string> SaveFile(IFormFile file, string fullPath, string fileName);
    }
}
