using Microsoft.AspNetCore.SignalR.Client;
using SignalRClient.Shared;
using TypedSignalR.Client;

HubConnection connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5180/hubs/chathub")
    .Build();

var hub = connection.CreateHubProxy<IChatHub>();