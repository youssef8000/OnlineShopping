import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Product } from 'src/app/model/product';
import { Users } from 'src/app/model/users';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent implements OnInit {
  productsList: Product[] = [];
  UserList: Users[] = [];
  productObj: Product = {
    id: '',
    title: '',
    category: '',
    description: '',
    price: '',
    location: '',
    user_id: '',
    photos: []
  };
    id:string ='';
    title:string ='';
    category:string ='';
    description:string ='';
    price:string ='';
    location:string ='';
    user_id:string ='';
    photos:string[]= [];
    selectedFiles: FileList | null = null;
    uploadedPhotos: string[] = [];
    task:AngularFireUploadTask | undefined;
    ref:AngularFireStorageReference | undefined;
    fillTitle:any;
    fillcategory:any;
    filldescription:any;
    fillprice:any;
    filllocation:any;
    userIdProduct: string = '';
    userId: string = '';
    userEmail: string = '';
    userData: any = null;
    productForm!: FormGroup;

  constructor(private auth: AuthService, private data: ProductService
    ,private fst: AngularFireStorage ,    private formBuilder: FormBuilder
  ) {
    this.userId = localStorage.getItem('userId') ?? '';
    this.userEmail = localStorage.getItem('userEmail') ?? '';
   }

  ngOnInit(): void {
    this.getAllUser();
    this.productForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      location: ['', Validators.required],
      photos: [null, Validators.required]
    });
  }
  getAllUser() {
    this.auth.getAllUsers().subscribe((res: any) => {
      res.forEach((userDoc: any) => {
        const userData = userDoc.payload.doc.data() as Users;
        if (userData.email === this.userEmail) {
          this.userIdProduct = userData.user_id;
          return;
        }
      });
    }, err => {
      console.error('Error while fetching user data:', err);
    });
  }
  get formControls() {
    return this.productForm.controls;
  }
  resetForm() {
    this.productForm.reset();
    this.uploadedPhotos = [];
    this.fillTitle = null;
    this.fillcategory = null;
    this.filldescription = null;
    this.fillprice = null;
    this.filllocation = null;
    this.id = '';
    this.title = '';
    this.description = '';
    this.price = '';
    this.location = '';
    this.category = '';
    this.user_id = '';
  }
  onFileSelected(event: any) {
    Array.from(event.target.files).forEach((file: any) => {
      const id = Math.random().toString(36).substring(2);
      const ref = this.fst.ref(id);
      const task = ref.put(file);
      task.then((snapshot) => {
        snapshot.ref.getDownloadURL().then((url) => {
          this.uploadedPhotos.push(url);
          console.log('Uploaded photo URL:', url);
        });
      });
    });
  }

  addProduct(uploadedPhotos: string[]) {
    if (this.productForm.invalid) {
      this.fillTitle = this.formControls['title'].errors?.['required'] ? 'Fill title fields' : null;
      this.fillcategory = this.formControls['category'].errors?.['required'] ? 'Fill category fields' : null;
      this.filldescription = this.formControls['description'].errors?.['required'] ? 'Fill description fields' : null;
      this.fillprice = this.formControls['price'].errors?.['required'] ? 'Fill price fields' : null;
      this.filllocation = this.formControls['location'].errors?.['required'] ? 'Fill location fields' : null;
      return;
    }
    const newProduct: Product = {
      id: '',
      title: this.title,
      description: this.description,
      category: this.category,
      location: this.location,
      user_id: this.userEmail,
      price: this.price,
      photos: uploadedPhotos,
    };

    this.data.addProduct(newProduct)
      .then(() => {
        this.resetForm();
        this.uploadedPhotos = [];
        alert('Product added successfully.');
      })
      .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
      });
  }

}
