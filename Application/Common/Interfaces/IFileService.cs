using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Application.Common.Interfaces
{
    public interface IFileService
    {
        Task<string> Save(IFormFile file, string filePath, string fileName);

        void Remove(string path);
    }
}
