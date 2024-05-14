import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-myproduct',
  templateUrl: './myproduct.component.html',
  styleUrls: ['./myproduct.component.css']
})
export class MyproductComponent implements OnInit {
  productsList: Product[] = [];
  userId: string = '';
  userEmail: string = '';
  userData: any = null;
  constructor(private data: ProductService) {
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
  }

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct() {
    this.data.getAllProducts().subscribe(res => {
      this.productsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((product: Product) => product.user_id == this.userEmail);
    }, err => {
      alert('Error while fetching product data');
    });
  }

  confirmRemove(product: Product) {
    const confirmDelete = window.confirm('Are you sure you want to remove this product?');
    if (confirmDelete) {
      this.data.deleteProduct(product.id);
      alert('Product removed successfully.');
    }
  }
}
