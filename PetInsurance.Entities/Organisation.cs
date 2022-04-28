using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetInsurance.Entities
{
    /// <summary>
    /// same for GetSpca and GetOrgs
    /// </summary>
    public class Organisation
    {
        public string organisationName { get; set; }
        public string phoneNumber { get; set; }
        public string address { get; set; }
        public int organisationId { get; set; }
    }

    public class FreeCoverPayload
    {
        public string applicationId { get; set; }
        public List<PetDetail> petDetails { get; set; }
        public ClientDetail clientDetails { get; set; }
        public OrganisationDetail organisationDetails { get; set; }
        public LeadSource leadSource { get; set; }
    }

    public class PetDetail
    {
        public string name { get; set; }
        public string dob { get; set; }
        public string sex { get; set; }
        public int breedId { get; set; }
        public string coverExclusions { get; set; }
    }

    public class ClientDetail
    {
        public string title { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string secondaryPhone { get; set; }
        public string primaryPhone { get; set; }
        public string email { get; set; }
        public string address { get; set; }
        public string suburb { get; set; }
        public string city { get; set; }
        public string postCode { get; set; }
    }

    public class OrganisationDetail
    {
        public int organisationId { get; set; }
        public string alternateEmailaddress { get; set; }
    }

    public class LeadSource
    {
        public int? organisationId { get; set; }
        public string sourceType { get; set; }
        public string sourceName { get; set; }
        public string sourceAddress { get; set; }
        public string sourceOther { get; set; }
    }
}
