import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bags',
  templateUrl: './bags.component.html',
  styleUrls: ['./bags.component.css']
})
export class BagsComponent implements OnInit {
  productsList: Product[] = [];

  constructor(private auth: AuthService, private data: ProductService,private router: Router) { }

  ngOnInit(): void {
    this.getAllProduct();
  }
  getAllProduct() {
    this.data.getAllProducts().subscribe(res => {
      this.productsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        return { id, ...data};
      }).filter((product: Product) => product.category === 'bags');
    }, err => {
      alert('Error while fetching product data');
    });
  }
}
