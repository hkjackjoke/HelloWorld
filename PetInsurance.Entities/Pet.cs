using System;

namespace PetInsurance.Entities
{
    public class Pet
    {
        public string PetName { get; set; }
        public string Animal { get; set; }
        public string AnimalBreed { get; set; }
        public DateTime? DOB { get; set; }
        public string Gender { get; set; }
    }
}
