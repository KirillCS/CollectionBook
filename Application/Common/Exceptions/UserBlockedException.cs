using System;

namespace Application.Common.Exceptions
{
    public class UserBlockedException : Exception
    {
        public UserBlockedException()
        {
        }

        public UserBlockedException(string blockReason)
        {
            BlockReason = blockReason;
        }

        public string BlockReason { get; }
    }
}
