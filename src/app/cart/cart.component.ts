import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { ProductService } from '../service/product.service';
import { Cart } from '../model/cart';
import { Product } from '../model/product';
import { Checkout } from '../model/checkout';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

const plus =
`
<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
<path d="M6 12H18M12 6V18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
const minus =
`
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 12L18 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  counterValue = 1;
  incrementCounter(cart: Cart) {
    cart.count++;
    this.data.updateCart(cart.id, cart)
      .then(() => {
        console.log('Cart updated successfully.');
      })
      .catch((error: any) => {
        console.error('Error updating cart:', error);
        alert('Failed to update cart. Please try again.');
      });
  }

  decrementCounter(cart: Cart) {
    if (cart.count > 1) {
      cart.count--;
      this.data.updateCart(cart.id, cart)
        .then(() => {
          console.log('Cart updated successfully.');
        })
        .catch((error: any) => {
          console.error('Error updating cart:', error);
          alert('Failed to update cart. Please try again.');
        });
    }
  }
  
  getTotalPrice(): number {
    let totalPrice = 0;
    for (const cartItem of this.cartList) {
      const product = this.productsList.find(productItem => productItem.id === cartItem.product_id);
      if (product && typeof product.price === 'number' && typeof cartItem.count === 'number') {
        totalPrice += product.price * cartItem.count;
      }
    }
    return totalPrice;
  }
  cartList: Cart[] = [];
  productsList: Product[] = [];
  userId: string = '';
  userEmail: string = '';
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer
    ,private data: ProductService ,private afs : AngularFirestore, private router :Router) {
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
    iconRegistry.addSvgIconLiteral('plus', sanitizer.bypassSecurityTrustHtml(plus));
    iconRegistry.addSvgIconLiteral('minus', sanitizer.bypassSecurityTrustHtml(minus));
   }
  ngOnInit(): void {
    this.getAllcart();
    this.getAllProduct();
  }
  getAllcart() {
    this.data.getAllCart().subscribe(res => {
      this.cartList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((cart: Cart) => cart.user_email == this.userEmail);
    }, err => {
      alert('Error while fetching product data');
    });
  }
  getAllProduct() {
    this.data.getAllProducts().subscribe(res => {
      this.productsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      });
    }, err => {
      alert('Error while fetching product data');
    });
  }
  confirmRemove(cart: Cart) {
    const confirmDelete = window.confirm('Are you sure you want to remove this product?');
    if (confirmDelete) {
      this.data.deleteCart(cart.id);
      alert('Product removed successfully.');
    }
  }
  Removecart(cart: Cart) {
      this.data.deleteCart(cart.id);
  }
  addToCheckout(cartList: Cart[]) {
    const checkoutList: Checkout[] = [];
    for (const cartItem of cartList) {
      const product = this.productsList.find(productItem => productItem.id === cartItem.product_id);
      if (product && typeof product.price === 'number' && typeof cartItem.count === 'number') {
        const checkoutItem: Checkout = {
          id: '',
          user_email: this.userEmail,
          product_id: cartItem.product_id,
          count: cartItem.count,
          total_price: product.price * cartItem.count +50,
          seller_email:product.user_id,
          rating:'',
          feedback:''
        };
        checkoutList.push(checkoutItem);
      }
      this.Removecart(cartItem);

    }
    checkoutList.forEach(checkoutItem => {
      checkoutItem.id = this.afs.createId();
      this.afs.collection('checkout').add(checkoutItem)
        .then(() => {
          console.log('Checkout added to Firestore');
          alert('Checkout added successfully.');

        })
        .catch(error => console.error('Error adding checkout:', error));
    });
    this.router.navigate(['/home']);
  }
}
