using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PetInsurance_Site.Models
{
    public class ApplicantModel
    {
        public string token { get; set; }
        public string leadId  { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string contactNumber { get; set; }
        public string channel { get; set; }
        public string creationDate { get; set; }
        public string modifiedDate { get; set; }
        public string leadScore { get; set; }
        public string status { get; set; }
        public string state { get; set; }
        public string quoteId { get; set; }
        public List<ApplicantPetModel> pets { get; set; }

 
    }
    public class ApplicantPetModel
    {
        public string petId { get; set; }
        public string petName { get; set; }
        public string animal { get; set; }
        public string animalBreed { get; set; }
        public string dob { get; set; }
        public string gender { get; set; }
    }
}