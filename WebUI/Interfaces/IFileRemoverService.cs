namespace WebUI.Interfaces
{
    public interface IFileRemoverService
    {
        void RemoveAvatar(string avatarPath);

        void RemoveFile(string fullPath);
    }
}
