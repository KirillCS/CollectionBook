﻿using Application.Common.Mappings;
using Domain.Entities;

namespace Application.Common.Dto
{
    public class CollectionNameDto : IMapFrom<Collection>
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}
