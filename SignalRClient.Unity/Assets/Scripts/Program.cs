using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using UnityDependencyInjection.Core;
using UnityEngine;
using TypedSignalR.Client;
using SignalRClient.Shared;
using System.Threading.Tasks;
using System;

public class Program : MonoBehaviour, IInstaller
{
    public void InstallBindings(IServiceCollection services)
    {
        services.AddSingleton<Test>();
    }
}

public class Test
{
    public Test()
    {
        HubConnection connection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5180/hubs/chathub")
            .WithAutomaticReconnect()
            .Build();

        var hub = connection.CreateHubProxy<IChatHub>();
        var subscription1 = connection.Register<IChatReceiver>(new ChatReceiver());
    }
}

public class ChatReceiver : IChatReceiver
{
    public Task OnJoin(string username, DateTime dateTime)
    {
        throw new NotImplementedException();
    }

    public Task OnLeave(string username, DateTime dateTime)
    {
        throw new NotImplementedException();
    }

    public Task OnReceiveMessage(Message message)
    {
        throw new NotImplementedException();
    }
}