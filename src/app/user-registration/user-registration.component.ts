import { Component, OnInit } from '@angular/core';
import { RegistrationModel } from '../models/registration';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  userTypes = [];
  constructor() { }
  model: any = {};
 
  onSubmit() {
    console.log(JSON.stringify(this.model))
  }

  ngOnInit() {
    this.model = new RegistrationModel('', '', '', '', '');
    this.fillUserTypes();
  }

  fillUserTypes() {
    this.userTypes.push({
      "id": 1,
      "typeName": "Regular"
    });

    this.userTypes.push({
      "id": 2,
      "typeName": "Manager"
    });
  }

  userTypeChanged() {
    
  }

}
