import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { Product } from '../model/product';
import { Checkout } from '../model/checkout';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  productsList: Product[] = [];
  checkoutList: Checkout[] = [];
  userId: string = '';
  userEmail: string = '';
  constructor(private data: ProductService ,private routing :Router) {
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
  }
  ngOnInit(): void {
    this.getAllCheckouts();
    this.getAllProduct();
  }
  getAllCheckouts() {
    this.data.getAllCheckout().subscribe(res => {
      this.checkoutList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((product: Checkout) => product.user_email == this.userEmail);
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

}
