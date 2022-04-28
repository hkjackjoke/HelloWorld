using System;
using System.Configuration;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PetInsurance.Common;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace EmailService
{
    public class EmailService
    {
        public async Task<object> SendEmailAsync(Callback myCallback)
        {
            Exception ex = null;
            var toEmail = ConfigurationHelper.GetValue("PetQnB_ToEmail");
            var apiKey = ConfigurationHelper.GetValue("PetQnB_SendGridApiKey");
            for (int i = 0; i < 3; i++)
            {
                try
                {
                    var client = new SendGridClient(apiKey);
                    var from = new EmailAddress("donotreply@southerncross.co.nz", "Pet site Call back request");
                    var subject = $"Please call back to number {myCallback.PhoneNumber}";
                    var to = new EmailAddress(toEmail, "Support");
                    var plainTextContent = $@"Please call back. 
                        {Environment.NewLine} 
                        Name: {myCallback.FullName}. 
                        {Environment.NewLine} 
                        Phone number: {myCallback.PhoneNumber}. 
                        {Environment.NewLine} 
                        Email: {myCallback.EmailAddress}.
                        { Environment.NewLine}
                        Pet's name: {myCallback.PetsName} 
                        { Environment.NewLine}
                        Policy number: {myCallback.PolicyNumber} 
                        { Environment.NewLine}
                        Question or message: {myCallback.Message}
                        { Environment.NewLine}
                        Reasons for contact: {myCallback.IdLikeTo} ";
                    var htmlContent = $"<p>{plainTextContent.Replace(Environment.NewLine, "</p><p>")}</p>";
                    var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                    msg.ReplyTo = new EmailAddress(myCallback.EmailAddress);
                    var response = await client.SendEmailAsync(msg).ConfigureAwait(false);
                    if (response.StatusCode != HttpStatusCode.Accepted)
                    {
                        throw new Exception(JsonConvert.SerializeObject(response));
                    }
                    return response;
                }
                catch (Exception e)
                {
                    // TODO log debug
                    // wait for 1 sec and try again
                    ex = e;
                    Thread.Sleep(1000);
                }
            }

            // TODO log error
            throw ex;
        }
    }
}
