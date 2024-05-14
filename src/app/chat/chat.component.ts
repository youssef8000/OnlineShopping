import { Component, OnInit } from '@angular/core';
import { Chat } from '../model/chat';
import { ChatService } from '../service/chat.service';
import { AuthService } from '../service/auth.service';
import { Users } from '../model/users';
import { Messenger } from '../model/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  ChatList: Chat[] = [];
  UserList: Users[] = [];
  userId: string = '';
  userEmail: string = '';
  userData: any = null;
  constructor(private chat: ChatService , private user:AuthService) {
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
  }


  ngOnInit(): void {
    this.getAllChat();
    this.getAllUser();
    this.getAllMessage();
  }
  messageList: Messenger[] = [];
 firstmessage:any;
  getAllMessage() {
    this.chat.getAllmessage().subscribe(res => {
      this.messageList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data };
      }).filter((message: Messenger) =>
        (message.send_email === this.userEmail ) ||
        (message.received_email === this.userEmail )
      );

      this.messageList.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
      this.firstmessage=this.messageList[0];
    }, err => {
      console.error('Error fetching message data:', err);
      alert('Error while fetching message data');
    });
  }
  getFirstMessage(chat: Chat): string | undefined {
    const chatMessages = this.messageList.filter(message =>
      (message.send_email === chat.user_email && message.received_email === chat.seller_email) ||
      (message.received_email === chat.user_email && message.send_email === chat.seller_email)
    );
    return chatMessages.length > 0 ? chatMessages[0].message : 'No messages';
  }
  getAllChat() {
    this.chat.getAllchat().subscribe(res => {
      this.ChatList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data };
      }).filter((chat: Chat) => chat.user_email === this.userEmail || chat.seller_email === this.userEmail);
    }, err => {
      alert('Error while fetching chat data');
    });
  }
  getAllUser() {
    this.user.getAllUsers().subscribe(res => {
      this.UserList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      });
    }, err => {
      alert('Error while fetching user data');
    });
  }
  confirmRemove(chat: Chat) {
    const confirmDelete = window.confirm('Are you sure you want to remove this Chat?');
    if (confirmDelete) {
      this.chat.deletechat(chat.id);
      alert('Chat removed successfully.');
    }
  }
}
