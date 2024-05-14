import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.css']
})
export class UpdateproductComponent implements OnInit {
  productsList: Product[] = [];
  userId: string = '';
  userEmail: string = '';
  userData: any = null;
  idProduct : any;
  task:AngularFireUploadTask | undefined;
  ref:AngularFireStorageReference | undefined;
  uploadedPhotos: string[] = [];

  constructor(private data: ProductService,private router:ActivatedRoute,private fst: AngularFireStorage ,private afs: AngularFirestore) {
    this.idProduct = this.router.snapshot.paramMap.get('id');
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
  }
  ngOnInit(): void {
    this.getAllProduct();

  }
  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => {
      const id = Math.random().toString(36).substring(2);
      const ref = this.fst.ref(id);
      const task = ref.put(file);
      task.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          this.uploadedPhotos.push(url);
        });
      });
    });
  }
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
 updateProduct(productId: string, productData: Product, uploadedPhotos: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const updatedData: any = { ...productData };
      if (uploadedPhotos && uploadedPhotos.length > 0) {
        updatedData.photos = uploadedPhotos;
      }
      this.afs.collection('product', ref => ref.where('id', '==', productId))
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update(updatedData)
              .then(() => {
                alert('Product data updated successfully.'); 
                resolve();
              })
              .catch((error: any) => {
                reject(error);
              });
          });
        }, (error: any) => {
          reject(error);
        });
    });
  }

}
