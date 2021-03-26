using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace WebUI.Interfaces
{
    public interface IFormFileSaver
    {
        Task<string> SaveFile(IFormFile file, string filePath, string fileName);
    }
}
