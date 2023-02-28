module CncSolution.PlaywrightTests

open System
open Microsoft.Playwright
open Microsoft.Playwright.NUnit
open NUnit.Framework

// Run non-headless: dotnet test -- Playwright.BrowserName=chromium Playwright.LaunchOptions.Headless=false

type ContactForm =
    { Url: string
      Name: string
      Company: string
      Email: string
      Phone: string
      Message: string }

[<TestFixture>]
type Tests() =
    inherit PageTest()

    member x.Fill selector value =
        x.Page.Locator(selector).FillAsync(value)

    member x.SubmitForm(data: ContactForm) =
        task {
            let! _ = x.Page.GotoAsync(data.Url)
            do! x.Fill "input[name='name']" data.Name
            do! x.Fill "input[name='company']" data.Company
            do! x.Fill "input[name='email']" data.Email
            do! x.Fill "input[name='telephone']" data.Phone
            do! x.Fill "#message" $"{data.Message} {DateTime.Now}"
            let request = x.Page.WaitForRequestAsync("**/umbraco/api/contact/post")
            do! x.Page.Locator("button[type='submit']").ClickAsync()
            let! _ = request
            let button = x.Page.Locator("#success")
            do! button.WaitForAsync(options = LocatorWaitForOptions(Timeout = Nullable<float32> 5000.0f))
            let! successVisible = button.IsVisibleAsync()
            Assert.True successVisible
        }

    [<Test>]
    member x.Dutch() =
        x.SubmitForm
            { Url = "https://cncsolutions.be/contacteer-ons/"
              Name = "Geautomatiseerde test"
              Company = "Auto Test NL"
              Email = "info@autotest.nl"
              Phone = "0999 88 77 66"
              Message = "Geautomatiseerd test bericht op " }

    [<Test>]
    member x.French() =
        x.SubmitForm
            { Url = "https://cncsolutions.be/fr/contactez-nous/"
              Name = "Test automatisé"
              Company = "Auto Test FR"
              Email = "info@autotest.fr"
              Phone = "0999 88 77 66"
              Message = "Message automatique sur " }

    [<Test>]
    member x.English() =
        x.SubmitForm
            { Url = "https://cncsolutions.be/en/contact-us/"
              Name = "Automated test"
              Company = "Auto Test EN"
              Email = "info@autotest.co.uk"
              Phone = "0999 88 77 66"
              Message = "Automated message on " }
