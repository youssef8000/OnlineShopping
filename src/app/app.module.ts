
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './sharedUi/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VarifyEmailComponent } from './auth/varify-email/varify-email.component';
import { FooterComponent } from './sharedUi/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'ngx-owl-carousel-o';
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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ForgotPasswordComponent,
    VarifyEmailComponent,
    FooterComponent,
    ViewproductComponent,
    AddproductComponent,
    CartComponent,
    WishlistComponent,
    BagsComponent,
    WatchesComponent,
    AirpodsComponent,
    ClothesComponent,
    FurnitureComponent,
    MyproductComponent,
    CheckoutComponent,
    SearchComponent,
    ProfileComponent,
    MessageComponent,
    ChatComponent,
    FeedbackComponent,
    UpdateproductComponent,
  ],

  imports: [
    BrowserModule,
    MatIconModule,
    CarouselModule ,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
