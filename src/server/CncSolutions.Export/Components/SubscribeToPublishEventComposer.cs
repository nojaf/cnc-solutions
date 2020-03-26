using CncSolutions.Export.Hubs;
using Microsoft.AspNet.SignalR;
using Umbraco.Core;
using Umbraco.Core.Composing;
using Umbraco.Core.Events;
using Umbraco.Core.Logging;
using Umbraco.Core.Services;
using Umbraco.Core.Services.Implement;

namespace CncSolutions.Export.Components
{
    public class CNCComposer : IUserComposer
    {
        public void Compose(Composition composition)
        {
            composition.Components().Append<SubscribeToPublishEventComponent>();
        }
    }

    public class SubscribeToPublishEventComponent : IComponent
    {
        private readonly ILogger _logger;

        public SubscribeToPublishEventComponent(ILogger logger)
        {
            _logger = logger;
        }

        public void Initialize()
        {
            ContentService.Published += ContentServiceOnPublished;
        }

        private void ContentServiceOnPublished(IContentService sender, ContentPublishedEventArgs e)
        {
            foreach (var node in e.PublishedEntities)
            {
                _logger.Debug<SubscribeToPublishEventComponent>($"Content {node.Id} published");
                var hub = GlobalHost.ConnectionManager.GetHubContext<GatsbyHub>();
                hub.Clients.All.nodePublished(node.Id);
            }
        }

        public void Terminate()
        {
            // Nothing to terminate
        }
    }
}