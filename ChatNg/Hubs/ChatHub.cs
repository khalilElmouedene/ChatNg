using ChatNg.ChatModels;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChatNg.Hubs
{
    public class ChatHub : Hub
    {
        public async Task NewMessage(Message msg)
        {
            await Clients.All.SendAsync("MessageReceived", msg);
        }
    }
}
