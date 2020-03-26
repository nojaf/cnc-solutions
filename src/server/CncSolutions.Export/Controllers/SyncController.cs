using System.Collections.Concurrent;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using CncSolutions.Export.Hubs;
using Microsoft.AspNet.SignalR;

namespace CncSolutions.Export
{
    public class SyncController : Umbraco.Web.WebApi.UmbracoApiController
    {
        [HttpGet]
        public IHttpActionResult Trigger()
        {
            var hub = GlobalHost.ConnectionManager.GetHubContext<GatsbyHub>();
            hub.Clients.All.nodePublished(99);
            return Ok();
        }
    }
}