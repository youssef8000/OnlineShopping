import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatIconModule} from '@angular/material/icon';
import { ProductService } from 'src/app/service/product.service';
import { Cart } from 'src/app/model/cart';
import { Messenger } from 'src/app/model/message';
import { ChatService } from 'src/app/service/chat.service';
import { Wishlist } from 'src/app/model/wishlist';
import { Product } from 'src/app/model/product';

const user_icon =
`
<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-width="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
</svg>

`;
const bell_icon =
`
<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"/>
</svg>

`;
const cart_icon =
`
<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
</svg>

`;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  search: string = '';
  userId: string = '';
  userEmail: string = '';
  totalnotification: number = 0;

  constructor(private chat: ChatService,private productData: ProductService, private authService: AuthService, private router: Router,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,private data:ProductService)
    {
      iconRegistry.addSvgIconLiteral('user_icon', sanitizer.bypassSecurityTrustHtml(user_icon));
      iconRegistry.addSvgIconLiteral('bell_icon', sanitizer.bypassSecurityTrustHtml(bell_icon));
      iconRegistry.addSvgIconLiteral('cart_icon', sanitizer.bypassSecurityTrustHtml(cart_icon));
      this.userId = localStorage.getItem('userId') ?? '';
      this.userEmail = localStorage.getItem('userEmail') ?? '';
      this.totalnotification = this.totalmessage + this.totalwishList;

    }

  ngOnInit(): void {
    this.getAllcart();
    this.getAllMessage();
    this.getAllWishlist();
    this.getAllProduct();
  }
  messageList: Messenger[] = [];
  totalmessage: number = 0;
   getAllMessage() {
     this.chat.getAllmessage().subscribe(res => {
       this.messageList = res.map((e: any) => {
         const data = e.payload.doc.data();
         const id = e.payload.doc.id;
         return { id, ...data };
       }).filter((message: Messenger) =>
        message.received_email === this.userEmail && message.isread === false
      );
      this.totalmessage = this.messageList.length;
      this.totalnotification = this.totalmessage + this.totalwishList;
     }, err => {
       console.error('Error fetching message data:', err);
       alert('Error while fetching message data');
     });
   }
   markMessageAsRead(message: Messenger) {
    this.chat.updateMessageStatus(message, "true").then(() => {
      this.router.navigate(['/message', message.send_email]);
    }).catch((error: any) => {
      console.error('Error updating message status:', error);
      alert('Failed to update message status. Please try again.');
    });
  }
  markwishlistAsRead(wishlist: Wishlist) {
    this.data.updateWishlistStatus(wishlist, "true").then(() => {
      this.router.navigate(['/wishlist']);
    }).catch((error: any) => {
      console.error('Error updating wishlist status:', error);
      alert('Failed to update wishlist status. Please try again.');
    });
  }
   wishList: Wishlist[] = [];
   totalwishList: number = 0;
    getAllWishlist() {
      this.productData.getAllWishlists().subscribe(res => {
        this.wishList = res.map((e: any) => {
          const data = e.payload.doc.data();
          const id = e.payload.doc.id;
          return { id, ...data };
        }).filter((wish: Wishlist) =>
          wish.user_email === this.userEmail && wish.isShow === false
       );
       this.totalwishList = this.wishList.length;
       this.totalnotification = this.totalmessage + this.totalwishList;
      }, err => {
        console.error('Error fetching message data:', err);
        alert('Error while fetching message data');
      });
    }
    productsList: Product[] = [];

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
  searchProducts() {
    if (this.search.trim() !== '') {
      this.router.navigate(['/search'], { queryParams: { q: this.search } });
    }
  }
  totalCartCount: number = 0;
  cartList: Cart[] = [];

  getAllcart() {
    this.data.getAllCart().subscribe(res => {
      this.cartList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data };
      }).filter((cart: Cart) => cart.user_email === this.userEmail);

      this.totalCartCount = this.cartList.reduce((totalCount, cartItem) => totalCount + cartItem.count, 0);
    }, err => {
      alert('Error while fetching product data');
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
