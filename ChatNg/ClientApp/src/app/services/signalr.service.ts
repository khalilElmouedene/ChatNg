import { Injectable, EventEmitter } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Messages } from '../models/message';
import { Message } from '@progress/kendo-angular-conversational-ui';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  messageReceived = new EventEmitter<Messages>();
  private connectionIsEstablished = false;
  connectionEstablished = new EventEmitter<Boolean>();
  private _hubConnection: HubConnection;
  constructor() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }


  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(window.location.href + 'ChatHub')
      .build();
  }

  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(function () { this.startConnection(); }, 5000);
      });
  }

  private registerOnServerEvents(): void {
    this._hubConnection.on('MessageReceived', (data: any) => {
      this.messageReceived.emit(data);
    });
  }


  sendMessage(message: Message) {
    this._hubConnection.invoke('NewMessage', message);
  }


}
