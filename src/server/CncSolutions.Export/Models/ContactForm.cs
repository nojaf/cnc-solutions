using System.ComponentModel.DataAnnotations;

namespace CncSolutions.Export.Models
{
    public class ContactForm
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Company { get; set; }
        public string Address { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Telephone { get; set; }
        public string Message { get; set; }
    }
}