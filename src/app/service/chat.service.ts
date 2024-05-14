import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Chat } from '../model/chat';
import { Messenger } from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private afs : AngularFirestore) { }

  addmessage(message : Messenger) {
    message.id = this.afs.createId();
    return this.afs.collection('/message').add(message);
  }
  getAllmessage() {
    return this.afs.collection('/message').snapshotChanges();
  }
  updateMessageStatus(updatedMessage: Messenger , isread:string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection('message', ref => ref.where('received_email', '==', updatedMessage.received_email))
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({ isread: "true" })
              .then(() => {
                resolve();
              })
              .catch(error => {
                reject(error);
              });
          });
        }, error => {
          reject(error); 
        });
    });
  }
// ####################################################################################################

  addchat(chat : Chat) {
    chat.id = this.afs.createId();
    return this.afs.collection('/chat').add(chat);
  }
  getAllchat() {
    return this.afs.collection('/chat').snapshotChanges();
  }
  deletechat(chatId : string) {
    this.afs.collection('chat', ref => ref.where('id', '==', chatId))
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        });
  }

}
