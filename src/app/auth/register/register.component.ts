import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Users } from 'src/app/model/users';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  usertObj: Users = {
    user_id: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    information: '',
    address: ''
  };
  user_id:any ='';
  email : any = '';
  password : any = '';
  name : any = '';
  address : any = '';
  phone : any = '';
  information : any='';
  conf_password : any = '';

  UserForm!: FormGroup;
  constructor(private auth : AuthService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['',Validators.required, ],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      information: ['', Validators.required],
      password: ['', Validators.required],
      conf_password: ['', Validators.required],
    });
  }
  get formControls() {
    return this.UserForm.controls;
  }
  register() {


    if (this.UserForm.invalid) {
      this.email = this.formControls['email'].errors?.['required'] ? 'Fill email fields' : null;
      this.password = this.formControls['password'].errors?.['required'] ? 'Fill password fields' : null;
      this.conf_password = this.formControls['conf_password'].errors?.['required'] ? 'Fill conf_password fields' : null;
      this.information = this.formControls['information'].errors?.['required'] ? 'Fill information fields' : null;
      this.address = this.formControls['address'].errors?.['required'] ? 'Fill address fields' : null;
      this.phone = this.formControls['phone'].errors?.['required'] ? 'Fill phone fields' : null;
      this.name = this.formControls['name'].errors?.['required'] ? 'Fill name fields' : null;

      return;
    }     const newUser: Users = {
      user_id: '',
      name: this.formControls['name'].value,
      email: this.formControls['email'].value,
      phone: this.formControls['phone'].value,
      password: this.formControls['password'].value,
      address: this.formControls['address'].value,
      information: this.formControls['information'].value,
    };

    this.auth.register(newUser.email, newUser.password, newUser.address, newUser.name, newUser.phone, newUser.information);
  }


}
