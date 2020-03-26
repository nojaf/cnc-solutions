using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Umbraco.Core.Models.PublishedContent;

namespace CncSolutions.Export
{
    public class GraphController : Umbraco.Web.WebApi.UmbracoApiController
    {
        [HttpGet]
        public string CurrentTime()
        {
            var resume = Umbraco.Content(1382);
            return System.DateTime.UtcNow.ToLongTimeString();
        }

        [HttpGet]
        public IHttpActionResult Tree()
        {
            var rootNode = Umbraco.ContentAtRoot().First();
            return ParseNode(rootNode);
        }

        [HttpGet]
        public IHttpActionResult ById(int id)
        {
            var node = Umbraco.Content(id);
            return ParseNode(node);
        }

        private IHttpActionResult ParseNode(IPublishedContent rootNode)
        {
            try
            {
                var json = CncSolution.Graph.ExportTree(Umbraco, BaseUrl, rootNode);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                return ResponseMessage(new HttpResponseMessage()
                {
                    Content = content
                });
            }
            catch (Exception e)
            {
                Logger.Error(typeof(GraphController), e);
                return InternalServerError(e);
            }
        }

        private string BaseUrl => $"{Request.RequestUri.Scheme}://{Request.RequestUri.Host}";

        [HttpGet]
        public DateTime LastUpdateDate()
        {
            return CncSolution.Graph.LastUpdateDate(Umbraco);
        }
    }
}