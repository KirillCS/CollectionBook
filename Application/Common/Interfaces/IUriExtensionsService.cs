namespace Application.Common.Interfaces
{
    public interface IUriExtensionsService
    {
        string GenerateEmailConfirmationUri(string userId, string token);

        string GenerateEmailUpdateConfirmationUri(string userId, string newEmail, string token);

        string GeneratePasswordResetUri(string userId, string token);
    }
}
