import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  loginForm = new FormGroup({
    nickname: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private storage: Storage,
    public toastController: ToastController,
    public router: Router
    ) {
      this.storage.create();
    }

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
      const {accessToken } = await this.authService.login(this.loginForm.value);
      await this.storage.set('accessToken', accessToken);
      const { id } = await this.authService.me();
      await this.storage.set('id', id);
      this.presentToast('Login Successufully');
      this.router.navigate(['home']);
    } catch (err) {
      console.error('err:', err);
      this.presentToast('Error Signin', 'danger');
    }
  }

}
