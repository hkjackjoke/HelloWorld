using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using PetInsurance.DataAccessLayer;
using PetInsurance.Entities;

namespace PetInsurance.Models
{
    public class FreeInsuranceModel
    {
        public List<ValidationResult> ValidationError { get; set; }
        public string ErrorMessage { get; set; }
        public string PageSource { get; set; }
        public bool HasValidationError { get; set; }
        public bool AddAnother { get; set; }
        public string ApplicantType { get; set; }
        private string _applicationId = null;

        public string ApplicationId
        {
            get
            {
                if (_applicationId == null)
                {
                    _applicationId = Guid.NewGuid().ToString();
                }
                return _applicationId;
            }
        }

        [Display(Name = "Alternate email address")]
        public string AlternateEmail { get; set; }



        [Display(Name = "Title")]
        [Required(ErrorMessage = "Please select your title")]
        public string Title { get; set; }

        [Display(Name = "First name")]
        [Required(ErrorMessage = "Please enter in your first name")]
        public string FirstName { get; set; }

        [Display(Name = "Last name")]
        [Required(ErrorMessage = "Please enter in your last name")]
        public string LastName { get; set; }

        [Display(Name = "Primary phone")]
        [Required(ErrorMessage = "Please enter in your home primary number")]
        public string PrimaryPhone { get; set; }

        [Display(Name = "Secondary phone")]
        public string SecondaryPhone { get; set; }

        [Display(Name = "Email address")]
        [Required(ErrorMessage = "Please enter in your email address")]
        public string Email { get; set; }

        [Display(Name = "Confirm email address")]
        [Required(ErrorMessage = "Please confirm your email address")]
        public string EmailConfirm { get; set; }

        [Display(Name = "House number and street name")]
        [Required(ErrorMessage = "Please enter in your house number and street name")]
        public string Address { get; set; }

        [Display(Name = "Suburb")]
        [Required(ErrorMessage = "Please enter in your suburb")]
        public string Suburb { get; set; }

        [Display(Name = "City")]
        [Required(ErrorMessage = "Please enter in your city")]
        public string City { get; set; }

        [Display(Name = "Post code")]
        [Required(ErrorMessage = "Please enter in your post code")]
        public string PostCode { get; set; }

        [Display(Name = "Source")]
        [RequiredIf("ApplicantType", "pet-owner", ErrorMessage = "Please select source?")]
        public string WhereHearAboutUs { get; set; }

        public string ClinicId { get; set; }

        [Display(Name = "Clinic name")]
        [RequiredIf("WhereHearAboutUs", "Vet clinic", ErrorMessage = "Please enter in vet clinic name")]
        public string ClinicName { get; set; }


        [Display(Name = "Clinic address")]
        [RequiredIf("WhereHearAboutUs", "Vet clinic", ErrorMessage = "Please enter in vet clinic address")]
        public string ClinicAddress { get; set; }

        public string BreaderId { get; set; }

        [Display(Name = "Breeder name")]
        [RequiredIf("WhereHearAboutUs", "Breeder", ErrorMessage = "Please enter in breeder name")]
        public string BreaderName { get; set; }


        public string PetStoreId { get; set; }

        [Display(Name = "Pet store name")]
        [RequiredIf("WhereHearAboutUs", "Pet store", ErrorMessage = "Please enter in pet store name")]
        public string PetStoreName { get; set; }

        [Display(Name = "Pet store address")]
        [RequiredIf("WhereHearAboutUs", "Pet store", ErrorMessage = "Please enter in pet store address")]
        public string PetStoreAddress { get; set; }


        public string SPCABranchId { get; set; }

        [Display(Name = "SPCA branch name")]
        [RequiredIf("WhereHearAboutUs", "SPCA", ErrorMessage = "Please enter in SPCA branch name")]
        public string SPCABranchName { get; set; }

        [Display(Name = "SPCA branch address")]
        [RequiredIf("WhereHearAboutUs", "SPCA", ErrorMessage = "Please enter in SPCA branch address")]
        public string SPCABranchAddress { get; set; }

        [Display(Name = "Advertising - please specify:")]
        [RequiredIf("WhereHearAboutUs", "Advertising", ErrorMessage = "Please specify advertising")]
        public string WhereHearAdvertising { get; set; }


        [Display(Name = "Other - please specify:")]
        [RequiredIf("WhereHearAboutUs", "Other", ErrorMessage = "Please specify other")]
        public string WhereHearOther { get; set; }


        [RequiredIf("ApplicantType", "pet-owner", ErrorMessage = "Please declare 18 years and older")]
        public string AgeDeclare { get; set; }

        [Required(ErrorMessage = "Please confirm")]
        public string InfoDisclosedTrueComplete { get; set; }

        [RequiredIf("ApplicantType", "spca", "vet-breeder-apply", ErrorMessage = "Please confirm advised the pet owner?")]
        public string AdvisedPetOwner { get; set; }


        [Required(ErrorMessage = "Please confirm")]
        public string AcceptTerms { get; set; }


        [Display(Name = "e.g. 07 123 4567")]
        public string SouthernSearchPhone { get; set; }


        [Display(Name = "Vet Organisation ID")]
        [RequiredIf("ApplicantType", "vet-breeder", ErrorMessage = "Please enter Vet organisation ID")]
        public string VetOrganisationId { get; set; }

        [Display(Name = "SPCA branch")]
        [RequiredIf("ApplicantType", "spca", ErrorMessage = "Please enter SPCA organisation ID")]
        public string SPCAOrganisationId { get; set; }


        [Display(Name = "SPCA branch")]
        [RequiredIf("ApplicantType", "spca", ErrorMessage = "Please select SPCA Branch?")]
        public string SPCABranch { get; set; }


        public List<Pet> Pets { get; set; }


        public async Task SaveAsync()
        {
            await new ApiService().CreateFreeCoverAsync(CreateFreeCoverPayload());
        }

        private FreeCoverPayload CreateFreeCoverPayload()
        {
            var leadOrganisationId = ClinicId ?? BreaderId ?? PetStoreId ?? SPCABranchId;
            return new FreeCoverPayload()
            {
                applicationId = ApplicationId,
                petDetails = Pets.Select(p => p.ToPetDetail()).ToList(),
                clientDetails = new ClientDetail()
                {
                    address = Address,
                    city = City,
                    email = Email,
                    firstName = FirstName,
                    lastName = LastName,
                    postCode = PostCode,
                    suburb = Suburb,
                    title = Title,
                    secondaryPhone = SecondaryPhone,
                    primaryPhone = PrimaryPhone
                },
                organisationDetails = !string.IsNullOrEmpty(VetOrganisationId)
                    ? new OrganisationDetail()
                    {
                        organisationId = Convert.ToInt32(VetOrganisationId),
                        alternateEmailaddress = AlternateEmail
                    }
                    : !string.IsNullOrEmpty(SPCAOrganisationId)
                        ? new OrganisationDetail()
                        {
                            organisationId = Convert.ToInt32(SPCAOrganisationId),
                            alternateEmailaddress = AlternateEmail
                        }
                        : null,
                leadSource = string.IsNullOrEmpty(VetOrganisationId) && string.IsNullOrEmpty(SPCAOrganisationId)
                    ? new LeadSource()
                    {
                        organisationId = leadOrganisationId != null
                            ? (int?)Convert.ToInt32(leadOrganisationId)
                            : null,
                        sourceName = leadOrganisationId != null
                            ? null
                            : !string.IsNullOrEmpty(ClinicName)
                                ? ClinicName
                                : !string.IsNullOrEmpty(BreaderName)
                                     ? BreaderName
                                     : !string.IsNullOrEmpty(PetStoreName)
                                        ? PetStoreName
                                        : SPCABranchName,
                        sourceAddress = leadOrganisationId != null
                            ? null
                            : !string.IsNullOrEmpty(ClinicAddress)
                                ? ClinicAddress
                                : !string.IsNullOrEmpty(PetStoreAddress)
                                    ? PetStoreAddress
                                    : SPCABranchAddress,
                        sourceType = WhereHearAboutUs,
                        sourceOther = !string.IsNullOrEmpty(WhereHearOther)
                                ? WhereHearOther
                                : null
                    }
                    : null
            };
        }

        public void ResetOwnerAndPets()
        {
            this.Pets = new List<Pet>();
            this.Title = "";
            this.FirstName = "";
            this.LastName = "";
            this.PrimaryPhone = "";
            this.SecondaryPhone = "";
            this.Email = "";
            this.EmailConfirm = "";
            this.Address = "";
            this.Suburb = "";
            this.City = "";
            this.PostCode = "";
            this.WhereHearAboutUs = "";
            this.ClinicName = "";
            this.ClinicAddress = "";

            this.BreaderName = "";
            this.PetStoreName = "";
            this.PetStoreAddress = "";

            this.WhereHearOther = "";
            this.AlternateEmail = "";
            this.AgeDeclare = "";
            this.InfoDisclosedTrueComplete = "";
            this.AcceptTerms = "";
        }
        public string PetsToJSON()
        {
            var jsonSerialiser = new JavaScriptSerializer();
            return jsonSerialiser.Serialize(Pets);
        }
        public static FreeInsuranceModel GetPopulated()
        {
            var model = new FreeInsuranceModel();
            model.Title = "Mr";
            model.FirstName = "Bob";
            model.LastName = "Smith";
            model.PrimaryPhone = "09 123456";
            model.SecondaryPhone = "027 123456";
            model.Email = "bob@smith.com";
            model.EmailConfirm = "bob@smith.com";
            model.Address = "1 Smith Street";
            model.Suburb = "Smithburb";
            model.City = "Smithtown";
            model.PostCode = "1234";
            model.WhereHearAboutUs = "Vet clinic";
            model.ClinicName = "Peter Black Vet";
            model.ClinicAddress = "12 Black Street Smithtown";


            model.Pets = new List<Pet>();
            Pet p = new Pet();
            p.Id = 0;
            p.PetName = "Pups";
            p.PetBreed = "Dog";

            p.DOBDay = "19";
            p.DOBMonth = "5";
            p.DOBYear = "2018";
            p.PetGender = "Male";
            p.PetAnimal = "Dog";
            p.PetDefect = "NA";
            model.Pets.Add(p);

            model.AgeDeclare = "";
            model.InfoDisclosedTrueComplete = "";
            model.AcceptTerms = "";
            return model;
        }

        public FreeInsuranceModel Sanitise()
        {
            var reg = "[^A-Za-z0-9._-]";
            var properties = this.GetType().GetProperties();
            foreach (var prop in properties)
            {
                if (prop.PropertyType != typeof(string))
                    continue;
                if (!prop.CanRead || !prop.CanWrite)
                {
                    continue;
                }
                var currentValue = prop.GetValue(this);
                if (currentValue != null)
                {
                    var newValue = Regex.Replace(currentValue.ToString(), reg, "");
                    prop.SetValue(this, newValue);
                }
            }
            return this;
        }
    }
    public class Pet
    {

        public int Id { get; set; }
        public string PetName { get; set; }
        public string PetBreed { get; set; }
        public string DOBDay { get; set; }
        public string DOBMonth { get; set; }
        public string DOBYear { get; set; }
        public string PetGender { get; set; }
        public string PetAnimal { get; set; }
        public string PetDefect { get; set; }
        public string PetDefectSummary { get; set; }

        public PetDetail ToPetDetail()
        {
            return new PetDetail()
            {
                breedId = Convert.ToInt32(PetBreed),
                dob = $"{DOBDay}/{DOBMonth}/{DOBYear}",
                name = PetName,
                sex = PetGender,
                coverExclusions = PetDefect?.ToLower() == "no"
                    ? null
                    : PetDefectSummary
            };
        }
    }
    public class RequiredIfAttribute : ValidationAttribute, IClientValidatable
    {
        private String PropertyName { get; set; }
        private String[] DesiredValue { get; set; }
        private readonly RequiredAttribute _innerAttribute;

        public RequiredIfAttribute(String propertyName, params String[] desiredvalue)
        {
            PropertyName = propertyName;
            DesiredValue = desiredvalue;
            _innerAttribute = new RequiredAttribute();
        }

        protected override ValidationResult IsValid(object value, ValidationContext context)
        {
            var dependentValue = context.ObjectInstance.GetType().GetProperty(PropertyName).GetValue(context.ObjectInstance, null);
            foreach (var str in DesiredValue)
            {
                if ((string)dependentValue == str)
                {
                    if (!_innerAttribute.IsValid(value))
                    {
                        return new ValidationResult(FormatErrorMessage(context.DisplayName), new[] { context.MemberName });
                    }
                }
            }
            return ValidationResult.Success;
        }

        public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
        {
            var rule = new ModelClientValidationRule
            {
                ErrorMessage = ErrorMessageString,
                ValidationType = "requiredif",
            };
            rule.ValidationParameters["dependentproperty"] = (context as ViewContext).ViewData.TemplateInfo.GetFullHtmlFieldId(PropertyName);
            rule.ValidationParameters["desiredvalue"] = DesiredValue;

            yield return rule;
        }
    }
}