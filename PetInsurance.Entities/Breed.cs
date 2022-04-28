using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetInsurance.Entities
{
    public class Breed
    {
        public bool active { get; set; }
        public int? breedImageId { get; set; }
        public string breeddes { get; set; }
        public string breedName { get; set; }
        public int riskRating { get; set; }
        public int speciesId { get; set; }
        public int breedId { get; set; }
    }
}
