import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-airpods',
  templateUrl: './airpods.component.html',
  styleUrls: ['./airpods.component.css']
})
export class AirpodsComponent implements OnInit {
  productsList: Product[] = [];

  constructor(private auth: AuthService, private data: ProductService) { }

  ngOnInit(): void {
    this.getAllProduct();

  }
  getAllProduct() {
    this.data.getAllProducts().subscribe(res => {
      this.productsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((product: Product) => product.category === 'airpods');
    }, err => {
      alert('Error while fetching product data');
    });
  }

}
