import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Users } from '../model/users';
import { ProductService } from '../service/product.service';
import { Checkout } from '../model/checkout';
import { Product } from '../model/product';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  UserList: Users[] = [];
  productsList: Product[] = [];
  checkoutList: Checkout[] = [];
  @ViewChild('histogramChart', { static: false })
  histogramChart!: ElementRef;

  userId: string = '';
  userEmail: string = '';
  userData: any = null;
  constructor(private user: AuthService , private data: ProductService) {
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
  }

  ngOnInit(): void {
    this.getAllUser();
    this.getAllCheckouts();
    this.getAllProduct();
  }
  ngAfterViewInit(): void {
    this.registerChartScales();
    this.drawHistogram();
  }

  registerChartScales() {
    Chart.register(...registerables);
  }

  drawHistogram() {
    if (this.histogramChart) {
      const canvas = this.histogramChart.nativeElement;
      const ctx = canvas.getContext('2d');
      const filteredProducts = this.productsList.filter(product => product.user_id === this.userEmail);

      const productsData = filteredProducts.map(product => ({
        label: product.title,
        count: this.checkoutList.filter(checkout => checkout.product_id === product.id).length
      }));
      const totalProductCount = productsData.reduce((total, product) => total + product.count, 0);

      console.log('Total Product Count:', totalProductCount);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: productsData.map(data => data.label),
          datasets: [{
            label: 'Count of Products',
            data: productsData.map(data => data.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  productsData(arg0: string, productsData: any) {
    throw new Error('Method not implemented.');
  }

  getAllUser() {
    this.user.getAllUsers().subscribe(res => {
      this.UserList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((user: Users) => user.email == this.userEmail);
    }, err => {
      alert('Error while fetching user data');
    });
  }

  updateUser(userEmail: string, userData: Users) {
    this.user.updateUserData(userEmail, userData)
      .then(() => {
        alert('User data updated successfully.');
      })
      .catch((error: any) => {
        console.error('Error updating user data:', error);
        alert('Failed to update user data. Please try again.');
      });
  }

  getAllProduct() {
    this.data.getAllProducts().subscribe(res => {
      this.productsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Product; // Assuming Product has 'id' and other properties
      });
      this.drawHistogram(); // Call drawHistogram after data is loaded
    }, err => {
      alert('Error while fetching product data');
    });
  }

  getAllCheckouts() {
    this.data.getAllCheckout().subscribe(res => {
      this.checkoutList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data } as Checkout;
      }).filter((checkout: Checkout) => checkout.seller_email == this.userEmail);
    }, err => {
      alert('Error while fetching checkout data');
    });
  }

}
