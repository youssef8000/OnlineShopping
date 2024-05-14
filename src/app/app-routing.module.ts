import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {HomeComponent} from './home/home.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VarifyEmailComponent } from './auth/varify-email/varify-email.component'
import { AuthGuard } from './service/auth.guard';
import { ViewproductComponent } from './product/viewproduct/viewproduct.component';
import { AddproductComponent } from './product/addproduct/addproduct.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { BagsComponent } from './categoty/bags/bags.component';
import { WatchesComponent } from './categoty/watches/watches.component';
import { AirpodsComponent } from './categoty/airpods/airpods.component';
import { ClothesComponent } from './categoty/clothes/clothes.component';
import { FurnitureComponent } from './categoty/furniture/furniture.component';
import { MyproductComponent } from './product/myproduct/myproduct.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { MessageComponent } from './message/message.component';
import { ChatComponent } from './chat/chat.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { UpdateproductComponent } from './product/updateproduct/updateproduct.component';

const routes: Routes = [
  {path: 'login', component : LoginComponent},
  {path: 'register', component : RegisterComponent},
  {path: 'home', component : HomeComponent, canActivate: [AuthGuard]},
  {path: '', component : HomeComponent, canActivate: [AuthGuard]},
  {path: 'forgot-password', component : ForgotPasswordComponent},
  {path: 'varify-email', component : VarifyEmailComponent},
  {path: 'add_product', component : AddproductComponent},
  {path: 'view_product/:id', component : ViewproductComponent},
  {path: 'cart', component : CartComponent},
  {path: 'wishlist', component : WishlistComponent},
  {path: 'furniture', component : FurnitureComponent},
  {path: 'bags', component : BagsComponent},
  {path: 'watches', component : WatchesComponent},
  {path: 'clothes', component : ClothesComponent},
  {path: 'airpods', component : AirpodsComponent},
  {path: 'myproduct', component : MyproductComponent},
  {path: 'checkout', component : CheckoutComponent},
  {path: 'search', component : SearchComponent},
  {path: 'profile', component : ProfileComponent},
  {path: 'message/:id', component : MessageComponent},
  {path: 'chat', component : ChatComponent},
  {path: 'feedback/:id', component : FeedbackComponent},
  {path: 'updateProduct/:id', component : UpdateproductComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
