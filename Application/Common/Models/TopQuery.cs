namespace Application.Common.Models
{
    public class TopQuery
    {
        private readonly int count;

        public int Count
        {
            get => count;
            init
            {
                if (value < 0)
                {
                    value = 0;
                }

                count = value;
            }
        }
    }
}
