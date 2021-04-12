namespace Application.Common.Interfaces
{
    public interface ICurrentUserService
    {
        string Id { get; }

        string Login { get; }
    }
}
