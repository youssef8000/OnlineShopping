import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  searchResults: any[] = [];
  productsList: any[] = [];
  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProduct();
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'];
      this.searchProducts();
    });
  }
  searchProducts() {

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.productService.search(this.searchTerm).subscribe((results) => {
        this.searchResults = results;
      });
    }
  }
  getAllProduct() {
    this.productService.getAllProducts().subscribe(res => {
      this.productsList = res.map((e: any) => {
        const data = e.payload.doc.data();
        const id = e.payload.doc.id;
        // Include the ID in the data object
        return { id, ...data.id };
      });
    }, err => {
      alert('Error while fetching product data');
    });
  }
}
