namespace Application.Common.Interfaces
{
    public interface IUriService
    {
        string GenerateEmailConfirmationUri(string userId, string token);

        string GenerateEmailChangingUri(string userId, string newEmail, string token);
    }
}
