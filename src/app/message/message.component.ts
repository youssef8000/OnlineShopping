import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Messenger } from '../model/message';
import { AuthService } from '../service/auth.service';
import { ChatService } from '../service/chat.service';
import { Chat } from '../model/chat';
import { Users } from '../model/users';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  idSeller : any;
  userId: string = '';
  userEmail: string = '';
  constructor(private router:ActivatedRoute,private chat: ChatService, private user:AuthService  ) {
    this.idSeller = this.router.snapshot.paramMap.get('id');
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
}
messageObj: Messenger = {
  id : '',
  send_email :'',
  received_email :'',
  message : '',
  isread:'',
  date : '',
};
    id:any ='';
    send_email:any ='';
    received_email:any ='';
    message:any ='';
    date:any ='';
  ngOnInit(): void {
    this.getAllMessage();
    this.getAllUser(this.idSeller);

  }
  messageList: Messenger[] = [];

  getAllMessage() {
    this.chat.getAllmessage().subscribe(res => {
      this.messageList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data };
      }).filter((message: Messenger) =>
        (message.send_email === this.userEmail && this.idSeller === message.received_email) ||
        (message.received_email === this.userEmail && this.idSeller === message.send_email)
      );

      this.messageList.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });


    }, err => {
      console.error('Error fetching message data:', err);
      alert('Error while fetching message data');
    });
  }
  UserList: Users[] = [];
  filteredUserName: string = '';

  getAllUser(email: string) {
    this.user.getAllUsers().subscribe(res => {
      this.UserList = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      }).filter((user: Users) => user.email === email);
      if (this.UserList.length > 0) {
        this.filteredUserName = this.UserList[0].name;
      } else {
        this.filteredUserName = '';
      }
    }, err => {
      alert('Error while fetching user data');
    });
  }

  resetForm() {
    this.id = '';
    this.message = '';
  }

  addMessages() {
    if (this.message == '') {
      alert('Please write your message');
      return;
    }
        const newMessage: Messenger = {
          id: '',
          send_email: this.userEmail,
          received_email: this.idSeller,
          message: this.message,
          isread:false,
          date: new Date().getTime(),
        };

        this.chat.addmessage(newMessage)
          .then(() => {
            this.resetForm();
            })
          .catch(error => {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
          });

    }
}
