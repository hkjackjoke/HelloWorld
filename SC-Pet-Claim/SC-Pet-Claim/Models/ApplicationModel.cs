using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using SC_Pet_Claim.Client;

// using SC_Pet_Claim.Scripts;

namespace SC_Pet_Claim.Models
{
    public class ApplicationModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PetName { get; set; }
        public string PolicyNumber { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public string BankAccount { get; set; }
        public string VetBankAccount { get; set; }
        public string VetBankAccountName { get; set; }
        public string AgreeDeclaration { get; set; }
        public string DayToDayTreatment { get; set; }
        public string AccidentIllnessTreatment { get; set; }
        public InvoiceModel[] Invoices { get; set; }
        public List<FileModel> UploadedFiles { get; set; }
        public string CaptchaToken { get; set; }
        public ApplicationResult Submit()
        {
            var client = new PetClaimServiceHttpClient();
            var claimResponse = client
                .CreateClaimAsync(new ApiModel(this))
                .GetAwaiter()
                .GetResult();

            if (claimResponse.Success)
            {
                this.UploadFiles(client, claimResponse);
                
                client.FinishClaimAsync(claimResponse.ReferenceNo, claimResponse.SecurityHash)
                    .GetAwaiter()
                    .GetResult();

                return new ApplicationResult
                {
                    Success = true
                };
            }

            return new ApplicationResult{Success = false};
        }

        public string UploadFiles(PetClaimServiceHttpClient client, ClaimResponse claimResponse)
        {
            try
            {
                HttpFileCollection uploads = HttpContext.Current.Request.Files;
                this.UploadedFiles = new List<FileModel>();
                foreach (string key in uploads.AllKeys)
                {
                    var file = uploads[key];

                    client.CreateClaimAttachmentAsync(claimResponse.ReferenceNo, claimResponse.SecurityHash, key, file)
                        .GetAwaiter()
                        .GetResult();

                    this.UploadedFiles.Add(new FileModel
                    {
                        Type = key,
                        Filename = file.FileName
                    });
                }
                return "";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }

    public class ApplicationResult
    {
        public bool Success { get; set; }

    }
    public class InvoiceModel
    {
        public string Date { get; set; }
        public string Amount { get; set; }
        public string VetSpecialist { get; set; }
    }
    public class FileModel
    {
        public string Type { get; set; }
        public string Filename { get; set; }

    }
    public class Organisation
    {
        public string organisationName { get; set; }
        public string phoneNumber { get; set; }
        public string address { get; set; }
        public string organisationId { get; set; }
    }
}