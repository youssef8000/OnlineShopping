import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Wishlist } from '../model/wishlist';
import { Product } from '../model/product';
import { Cart } from '../model/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistList: Wishlist[] = [];
  productsList: Product[] = [];

  userId: string = '';
  userEmail: string = '';
  constructor(private data: ProductService ,private routing :Router) {
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
  }

  ngOnInit(): void {
    this.getAllWishlist();
    this.getAllProduct();
  }
  getAllWishlist() {
    this.data.getAllWishlists().subscribe(res => {
      this.wishlistList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((product: Wishlist) => product.user_email == this.userEmail);
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
  confirmRemove(wishlist: Wishlist) {
    const confirmDelete = window.confirm('Are you sure you want to remove this product?');
    if (confirmDelete) {
      this.data.deleteWishlist(wishlist.id);
      alert('Product removed successfully.');
    }
  }

  addCart(idProduct:any) {
    const cart: Cart = {
      id: '',
      user_email: this.userEmail,
      product_id: idProduct,
      count : 1
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
}
