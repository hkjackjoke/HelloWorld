using PetInsurance.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PetInsurance_Site.Models
{
    public class CustomerLeadModel
    {
        public string Token { get; set; }
        public string LeadId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public string EngagementChannel { get; set; }
        public bool IsExistingPetCustomer { get; set; }
        public bool IsSCHSMember { get; set; }
        public List<KeyValuePair<string, string>> LeadPreferences { get; set; }
        public string Channel { get; set; }
        public string LeadScore { get; set; }
        public string LeadType { get; set; }
        public string Status { get; set; }
        public string State { get; set; }
        public string QuoteId { get; set; }
        public List<PetModel> Pets { get; set; }
        public string PromoCode { get; set; }

        public CustomerLeadRequest ToCustomerLeadRequest()
        {
            return new CustomerLeadRequest
            {
                LeadId = this.LeadId,
                FirstName = this.FirstName,
                LastName = this.LastName,
                Email = this.Email,
                ContactNumber = this.ContactNumber,
                Channel = this.Channel,
                EngagementChannel = this.EngagementChannel,
                IsExistingPetCustomer = this.IsExistingPetCustomer.ToString(),
                IsSCHSMember = this.IsSCHSMember.ToString(),
                LeadPreferences = this.LeadPreferences.ToArray(),
                LeadScore = this.LeadScore,
                LeadType = this.LeadType,
                Pets = this.Pets.Select(p => new Pet
                {
                    Animal = p.Animal,
                    AnimalBreed = p.AnimalBreed,
                    DOB = p.Dob,
                    Gender = p.Gender,
                    PetName = p.PetName
                }).ToArray(),
                PromoCode = this.PromoCode,
                QuoteId = this.QuoteId,
                State = this.State,
                Status = this.Status
            };
        }
    }
    public class PetModel
    {
        public string PetId { get; set; }
        public string PetName { get; set; }
        public string Animal { get; set; }
        public string AnimalBreed { get; set; }
        public DateTime? Dob { get; set; }
        public string Gender { get; set; }

        public Pet ToPet()
        {
            return new Pet();
        }
    }
}