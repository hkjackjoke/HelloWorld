using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using EmailService;

namespace PetInsurance_Site.Models
{
    public class ContactModel
    {
        [Required(ErrorMessage = "Please enter in your fullname")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Please enter your phone number")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Please enter in your email address")]
        public string EmailAddress { get; set; }
        [Required(ErrorMessage = "Please select I'd like to...")]
        public string IdLikeTo { get; set; }
        public string PetsName { get; set; }
        public string PolicyNumber { get; set; }

        [Required(ErrorMessage = "Please enter in your message")]
        public string Message { get; set; }
        public List<ValidationResult> ValidationError { get; set; }
        public async Task SaveContactAsync()
        {
            // Add Email send code here.
            var emailService = new EmailService.EmailService();
            await emailService.SendEmailAsync(new Callback()
            {
                FullName = FullName,
                PhoneNumber = PhoneNumber,
                EmailAddress = EmailAddress,
                PetsName = PetsName,
                PolicyNumber = PolicyNumber,
                Message = Message,
                IdLikeTo = IdLikeTo
            }).ConfigureAwait(false);
        }
    }
}