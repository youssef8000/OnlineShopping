import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../model/product';
import { Wishlist } from '../model/wishlist';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { Cart } from '../model/cart';
import { Checkout } from '../model/checkout';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private afs : AngularFirestore) { }

  addProduct(product : Product) {
    product.id = this.afs.createId();
    return this.afs.collection('/product').add(product);
  }
  search(term: string): Observable<any[]> {
    console.log('Search term:', term);

    return this.afs.collection('product', ref => ref.where('title', '==', term.toLowerCase())).valueChanges()
      .pipe(
        switchMap(results => {
          console.log('Title results:', results);
          if (results.length > 0) {
            return of(results);
          } else {
            const categoryQuery = this.afs.collection('product', ref => ref.where('category', '==', term.toLowerCase())).valueChanges();
            const priceQuery = this.afs.collection('product', ref => ref.where('price', '<=', parseFloat(term))).valueChanges();
            const locationQuery = this.afs.collection('product', ref => ref.where('location', '==', term.toLowerCase())).valueChanges();

            return combineLatest([categoryQuery, priceQuery, locationQuery]).pipe(
              switchMap(([categoryResults, priceResults, locationResults]) => {
                console.log('Category results:', categoryResults);
                console.log('Price results:', priceResults);
                console.log('Location results:', locationResults);

                if (categoryResults.length > 0) {
                  return of(categoryResults);
                } else if (priceResults.length > 0) {
                  return of(priceResults);
                } else if (locationResults.length > 0) {
                  return of(locationResults);
                } else {
                  return of([]);
                }
              }),
              first()
            );
          }
        })
      );
  }
  getAllProducts() {
    return this.afs.collection('/product').snapshotChanges();
  }

  deleteProduct(productId : string) {
     this.afs.collection('product', ref => ref.where('id', '==', productId))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  }


// ############################################################################################

  addWishlist(wishlist : Wishlist) {
    wishlist.id = this.afs.createId();
    return this.afs.collection('/wishlist').add(wishlist);
  }
  // get all Wishlist
  getAllWishlists() {
    return this.afs.collection('/wishlist').snapshotChanges();
  }
  updateWishlistStatus(updatedWishlist: Wishlist , isread:string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afs.collection('wishlist', ref => ref.where('user_email', '==', updatedWishlist.user_email))
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({ isShow: "true" })
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
  deleteWishlist(wishlistId: string) {
    this.afs.collection('wishlist', ref => ref.where('id', '==', wishlistId))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  }
// ############################################################################################

addCart(cart : Cart) {
  cart.id = this.afs.createId();
  return this.afs.collection('/cart').add(cart);
}
// get all Wishlist
getAllCart() {
  return this.afs.collection('/cart').snapshotChanges();
}

updateCart(cartId: string, updatedCart: Cart): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.afs.collection('cart', ref => ref.where('id', '==', cartId))
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

deleteCart(cartId : string) {
  this.afs.collection('cart', ref => ref.where('id', '==', cartId))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
}

// ############################################################################################

getAllCheckout() {
  return this.afs.collection('/checkout').snapshotChanges();
}

updateCheckout(checkoutId: string, updatedCheckout: Checkout): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.afs.collection('checkout', ref => ref.where('id', '==', checkoutId))
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.update(updatedCheckout)
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
