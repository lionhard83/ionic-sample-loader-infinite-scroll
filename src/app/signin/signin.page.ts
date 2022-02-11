import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {
  signinForm = new FormGroup({
    nickname: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private authService: AuthService, public toastController: ToastController, private router: Router) { }

  async presentToast(message: string, color = 'success') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }

  async onSubmit() {
    try {
      await this.authService.signin(this.signinForm.value);
      this.presentToast('Login Successufully');
      await this.router.navigate(['/login']);
    } catch (err) {
      this.presentToast('Error Signin', 'danger');
    }
  }

}
