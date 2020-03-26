using System;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using CncSolutions.Export.Models;
using SendGrid;
using SendGrid.Helpers.Mail;
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
        [EnableCors("http://localhost:9000,http://www.cncsolutions.be", "*", "POST")]
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

        private string GetReceiver()
        {
            var contactContentType = UmbracoContext.Content.GetContentType("contact");
            var contactPage = this.UmbracoContext.Content.GetByContentType(contactContentType).FirstOrDefault();
            if (contactPage == null)
            {
                throw new Exception("No contact page exists");
            }

            return contactPage.Value("formRecipient")?.ToString();
        }

        private async Task SendMail(ContactForm form, string receiver)
        {
            var apiKey = ConfigurationManager.AppSettings["SendGrid"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("website@cncsolutions.be", "Website");
            var subject = "Contact formulier op cncsolutions.be";
            var to = new EmailAddress(receiver);

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

            var msg = MailHelper.CreateSingleEmail(from, to, subject,plainContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            Logger.Debug(typeof(ContactController), $"Response from SendGrid: {response}");
        }
    }
}