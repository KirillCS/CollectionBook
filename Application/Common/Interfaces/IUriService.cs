using System.Collections.Generic;

namespace Application.Common.Interfaces
{
    public interface IUriService
    {
        string GenerateEmailConfirmationUri(string userId, string token);

        string GenerateEmailChangingUri(string userId, string newEmail, string token);

        string GeneratePasswordResetUri(string userId, string token);

        string GenerateUri(string baseUrl, IDictionary<string, string> queryParams);
    }
}
