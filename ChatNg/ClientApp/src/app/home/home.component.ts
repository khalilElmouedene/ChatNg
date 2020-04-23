import { Component, OnInit, NgZone } from '@angular/core';
import { SignalrService } from '../services/signalr.service';
import { Observable, Subject } from 'rxjs';
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { Messages } from '../models/Message';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public feed: Observable<Message[]>;
  private local: Subject<Message> = new Subject<Message>();

  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0
  };
  messages = new Array<Messages>();
  message = new Messages();

  msg: Message[] = [];
  uniqueID: string = new Date().getTime().toString();
  constructor(private _signalr: SignalrService,
    private _ngZone: NgZone) { }




  ngOnInit(): void {
    this.subscribeToEvents();
  }


  private subscribeToEvents(): void {

    this._signalr.messageReceived.subscribe((message: Message) => {
      this._ngZone.run(() => {
        if (message.author.id !== this.uniqueID) {
          message.status = 'received';
          this.msg.push({
            author: message.author,
            text: message.text,
            timestamp: message.timestamp
          });
        }
      });
    });
  }



  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);
    this._signalr.sendMessage(e.message);
  }

}
