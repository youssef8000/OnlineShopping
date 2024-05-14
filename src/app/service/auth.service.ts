import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Users } from '../model/users';
import {
  Auth,
  authState,
} from '@angular/fire/auth';
import { concatMap, from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = authState(this.auth);

  constructor(private fireauth : AngularFireAuth , private auth: Auth,private router:Router, private firestore: AngularFirestore ) { }

  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.fireauth.onAuthStateChanged((user) => {
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          resolve(true);
        } else {
          localStorage.removeItem('isLoggedIn');
          resolve(false);
        }
      });
    });
  }
  async login(email: string, password: string) {
    try {
      const res = await this.fireauth.signInWithEmailAndPassword(email, password);
      const userId = res.user?.uid ?? '';
      const userEmail = res.user?.email ?? '';

      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', userEmail);

      if (res.user?.emailVerified == true) {
        await this.getUserData(userId);
        this.router.navigate(['home']);
      } else {
        await this.getUserData(userId);
        this.router.navigate(['home']);
      }
    } catch (err) {
        this.router.navigate(['/login']);
    }
  }

  getUserData(uid: string) {
    this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .subscribe((doc) => {
        const userData = doc.data();
        localStorage.setItem('userData', JSON.stringify(userData));
      });
  }
  updateUserData(useremail: string, userData: Users): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.collection('users', ref => ref.where('email', '==', useremail))
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update(userData)
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
  usertObj: Users = {
    user_id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    information: '',
    address: ''
  };
  user_id:string ='';
  email : string = '';
  password : string = '';
  name : string = '';
  address : string = '';
  phone : string = '';
  information : string='';
  conf_password : string = '';

  adduseruser(user : Users) {
    user.user_id = this.firestore.createId();
    return this.firestore.collection('/users').add(user);
  }

   getAllUsers() {
    return this.firestore.collection('/users').snapshotChanges();
  }
  async register(email: string, password: string, address: string, name: string, phone: string, information: string) {
    try {
        const res = await this.fireauth.createUserWithEmailAndPassword(email, password);
        alert('Registration Successful');
        this.router.navigate(['/login']);
        const newUser: Users = {
            user_id: res.user?.uid ?? '',
            name: name,
            email: email,
            phone: phone,
            password: password,
            address: address,
            information: information,
        };
        this.adduseruser(newUser);
    } catch (err:any) {
        alert(err.message);
        this.router.navigate(['/register']);
    }
}

  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userData');
      this.router.navigate(['/login']);
    }).catch((err) => {
      alert(err.message);
    });
  }

  forgotPassword(email : string) {
      this.fireauth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['/varify-email']);
      }, err => {
        alert('Something went wrong');
      })
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {

      this.router.navigate(['/home']);
      localStorage.setItem('token',JSON.stringify(res.user?.uid));

    }, err => {
      alert(err.message);
    })
  }
}
