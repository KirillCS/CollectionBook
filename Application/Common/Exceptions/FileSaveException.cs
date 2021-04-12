using System;

namespace Application.Common.Exceptions
{
    public class FileSaveException : Exception
    {
        public FileSaveException() : base("Failed to save file")
        { }
    }
}
