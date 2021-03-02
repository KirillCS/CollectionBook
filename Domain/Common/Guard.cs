using System;
using System.Threading.Tasks;

namespace Domain.Common
{
    public static class Guard
    {
        public static void Requires(Func<bool> predicate, Exception exception)
        {
            if (predicate())
            {
                return;
            }

            throw exception;
        }

        public static async Task RequiresAsync(Func<Task<bool>> predicate, Exception exception)
        {
            if (await predicate())
            {
                return;
            }

            throw exception;
        }
    }
}
