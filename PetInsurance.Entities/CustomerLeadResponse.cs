namespace PetInsurance.Entities
{
    public class CustomerLeadResponse
    {
        public bool IsSuccess { get; set; }
        public string LeadId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
