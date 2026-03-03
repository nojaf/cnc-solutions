using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using Azure.Identity;
using CncSolutions.Export.Models;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Umbraco.Web;

namespace CncSolutions.Export.Controllers
{
    public class ContactController : Umbraco.Web.WebApi.UmbracoApiController
    {
        [HttpGet]
        public string CurrentTime()
        {
            return DateTime.UtcNow.ToLongTimeString();
        }

        [HttpPost]
        [EnableCors("http://localhost:8000,http://localhost:9000,http://www.cncsolutions.be,https://cncsolutions.be", "*", "POST")]
        public async Task<IHttpActionResult> Post(ContactForm model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    Logger.Debug(typeof(ContactController), "Received invalid contact form");
                    return BadRequest(ModelState);
                }
                else
                {
                    var receiver = GetReceiver();
                    if (string.IsNullOrWhiteSpace(receiver)) throw new Exception("Receiver is not set!");
                    var logMessage = model.Message?.Replace("\r", "").Replace("\n", " ") ?? "";
                    if (logMessage.Length > 100) logMessage = logMessage.Substring(0, 100) + "...";
                    Logger.Info(typeof(ContactController), $"Contact form received - Name: {model.Name}, Company: {model.Company}, Email: {model.Email}, Telephone: {model.Telephone}, Message: {logMessage}, Receiver: {receiver}");
                    await SendMail(model, receiver);
                    Logger.Info(typeof(ContactController), "Processed contact form");
                    return Ok();
                }
            }
            catch (Exception e)
            {
                Logger.Error(typeof(ContactController), e);
                return BadRequest();
            }
        }

        private string GetContactPageValue(string propertyAlias)
        {
            var contactContentType = UmbracoContext.Content.GetContentType("contact");
            var contactPage = this.UmbracoContext.Content.GetByContentType(contactContentType).FirstOrDefault();
            if (contactPage == null)
            {
                throw new Exception("No contact page exists");
            }

            return contactPage.Value(propertyAlias)?.ToString();
        }

        private string GetReceiver()
        {
            return GetContactPageValue("formRecipient");
        }

        private async Task SendMail(ContactForm form, string receiver)
        {
            var tenantId = GetContactPageValue("tenantId");
            var clientId = GetContactPageValue("clientId");
            var clientSecret = GetContactPageValue("clientSecret");
            var sender = GetContactPageValue("senderEmail");

            var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
            var graphClient = new GraphServiceClient(credential);

            var plainTextContentBuilder = new StringBuilder();
            plainTextContentBuilder.AppendLine($"Op {DateTime.Now:MM/dd/yyyy} werd het contact formulier ingevuld.");
            plainTextContentBuilder.AppendLine();
            plainTextContentBuilder.AppendLine($"Naam: {form.Name}");
            plainTextContentBuilder.AppendLine($"Bedrijf: {form.Company}");
            plainTextContentBuilder.AppendLine(
                $"Adres: {form.Address}, {form.Zip} {form.City} {(string.IsNullOrWhiteSpace(form.Country) ? "" : $"({form.Country})")}");
            plainTextContentBuilder.AppendLine($"Telefoon: {form.Telephone}");
            plainTextContentBuilder.AppendLine($"Email: {form.Email}");
            if (!string.IsNullOrWhiteSpace(form.Message))
            {
                plainTextContentBuilder.AppendLine("Boodschap:");
                plainTextContentBuilder.AppendLine(form.Message);
            }

            var plainContent = plainTextContentBuilder.ToString();
            var htmlContent = $"<pre>{plainContent}</pre>";

            var message = new Message
            {
                Subject = "Contact formulier op cncsolutions.be",
                Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = htmlContent
                },
                ToRecipients = new List<Recipient>
                {
                    new Recipient
                    {
                        EmailAddress = new Microsoft.Graph.Models.EmailAddress
                        {
                            Address = receiver
                        }
                    }
                }
            };

            await graphClient
                .Users[sender]
                .SendMail
                .PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
                {
                    Message = message,
                    SaveToSentItems = true
                });

            Logger.Debug(typeof(ContactController), $"Response from SendGrid: sent via Microsoft Graph");
        }
    }
}