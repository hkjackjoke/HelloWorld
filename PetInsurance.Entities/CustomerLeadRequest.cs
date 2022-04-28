using System.Collections.Generic;

namespace PetInsurance.Entities
{
    public class CustomerLeadRequest
    {
        public string LeadId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public string LeadType { get; set; }
        public string Channel { get; set; }
        public string LeadScore { get; set; }
        public string Status { get; set; }
        public string State { get; set; }
        public KeyValuePair<string,string>[] LeadPreferences { get; set; }
        public string QuoteId { get; set; }
        public string IsExistingPetCustomer { get; set; }
        public string IsSCHSMember { get; set; }
        public string EngagementChannel { get; set; }
        public string PromoCode { get; set; }
        public Pet[] Pets { get; set; }
    }
}
