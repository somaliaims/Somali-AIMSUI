import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../models/login-model';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  constructor() { }

  ngOnInit() {
    this.model = new LoginModel('', '');
  }

}
