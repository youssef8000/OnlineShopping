import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router} from '@angular/router';
import { Checkout } from '../model/checkout';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  idchechout: any;
  userId: string = '';
  userEmail: string = '';
  feedback: string = '';
  rating: string = '';
  constructor(private router:ActivatedRoute,private afs: AngularFirestore,
    private route: Router) {
    this.idchechout = this.router.snapshot.paramMap.get('id');
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
}

  ngOnInit(): void {
  }
  updateFeedbackAndRating(): void {
    const updatedCheckout: Partial<Checkout> = {
      feedback: this.feedback,
      rating: this.rating
    };

    this.updateCheckout(this.idchechout, updatedCheckout)
      .then(() => {
        alert('Feedback and rating updated successfully.');
        this.route.navigate(['/home']); 
      })
      .catch(error => {
        console.error('Error updating feedback and rating:', error);
        alert('Failed to update feedback and rating. Please try again.');
      });
  }

  private updateCheckout(checkoutId: string, updatedCart: Partial<Checkout>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection('checkout', ref => ref.where('id', '==', checkoutId))
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update(updatedCart)
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
}
