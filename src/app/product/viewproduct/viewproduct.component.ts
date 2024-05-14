import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';
import { Wishlist } from 'src/app/model/wishlist';
import { AuthService } from 'src/app/service/auth.service';
import { Users } from 'src/app/model/users';
import { Cart } from 'src/app/model/cart';
import { Checkout } from 'src/app/model/checkout';
import { ChatService } from 'src/app/service/chat.service';
import { Messenger } from 'src/app/model/message';
import { Chat } from 'src/app/model/chat';
const heart =
`
<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
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
  selector: 'app-viewproduct',
  templateUrl: './viewproduct.component.html',
  styleUrls: ['./viewproduct.component.css']
})

export class ViewproductComponent implements OnInit {
  customOptions: OwlOptions = {
    loop:true,
    margin:10,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:3,
            nav:false
        },
        1000:{
            items:5,
            nav:true,
            loop:false
        }
    }
  }
  counterValue = 1;
  incrementCounter() {
    this.counterValue++;
  }
  decrementCounter() {
    if (this.counterValue >1) {
      this.counterValue--;
    }
  }

  idProduct;
  userId: string = '';
  userEmail: string = '';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
    private router:ActivatedRoute, private routing: Router,private data: ProductService
    ,private user: AuthService,private chat: ChatService
  ) {
    this.idProduct = this.router.snapshot.paramMap.get('id');
    this.getAllProduct();
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
    iconRegistry.addSvgIconLiteral('heart', sanitizer.bypassSecurityTrustHtml(heart));
    iconRegistry.addSvgIconLiteral('plus', sanitizer.bypassSecurityTrustHtml(plus));
    iconRegistry.addSvgIconLiteral('minus', sanitizer.bypassSecurityTrustHtml(minus));
   }
   productsList: Product[] = [];
   CheckoutList: Checkout[] = [];

   productsCategory: Product[] = [];

   UserList: Users[] = [];

   wishlistObj: Wishlist = {
    id: '',
    user_email: '',
    product_id: '',
    isShow:'',
  };

   getAllProduct() {
    this.data.getAllProducts().subscribe(res => {
      this.productsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((product: Product) => product.id === this.idProduct);
    }, err => {
      alert('Error while fetching product data');
    });
  }

  ngOnInit(): void {
    this.getAllProductCategory();
    this.getAllUser();
    this.getAllChekout();
  }

  getAllProductCategory() {
    this.data.getAllProducts().subscribe(res => {
      this.productsCategory = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      });
    }, err => {
      alert('Error while fetching product data');
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
      alert('Error while fetching product data');
    });
  }

  getAllChekout(){
    this.data.getAllCheckout().subscribe(res => {
      this.CheckoutList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((checkout: Checkout) => checkout.product_id === this.idProduct);
    }, err => {
      alert('Error while fetching product data');
    });
  }

  addWishlist() {
    const newwishlist: Wishlist = {
      id: '',
      user_email: this.userEmail,
      product_id: this.idProduct,
      isShow:false,
    };
    this.data.addWishlist(newwishlist)
      .then(() => {
        alert('Product added successfully to wishlist.');
      })
      .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product to wishlist. Please try again.');
      });
  }

  addCart() {
    const cart: Cart = {
      id: '',
      user_email: this.userEmail,
      product_id: this.idProduct,
      count : this.counterValue
    };
    this.data.addCart(cart)
      .then(() => {
        alert('Product added successfully to cart.');
        this.routing.navigate(['/cart']);

      })
      .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product to cart. Please try again.');
      });
  }

  addChatMessage(seller_Email: any ){
    this.chat.getAllchat().subscribe((chats: any[]) => {
      const existingChat = chats.find(chat => {
        return (chat.payload.doc.data().user_email === this.userEmail && chat.payload.doc.data().seller_email === seller_Email) ||
          (chat.payload.doc.data().user_email === seller_Email && chat.payload.doc.data().seller_email === this.userEmail);
      });

      if (!existingChat) {

        const newChat: Chat = {
          id: '',
          user_email: this.userEmail,
          seller_email: seller_Email,
        };

        this.chat.addchat(newChat)
          .then(() => {
            this.routing.navigate(['/message/'+seller_Email]);
            })
          .catch(error => {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
          });
      }else{
        this.routing.navigate(['/message/'+seller_Email]);
      }
    }, err => {
      console.error('Error fetching chats:', err);
      alert('Failed to fetch chats. Please try again.');
    });
  }
}
