using System;

namespace WebUI.Exceptions
{
    public class FileSaveException : Exception
    {
        public FileSaveException() : base("Failed to save file")
        { }
    }
}
