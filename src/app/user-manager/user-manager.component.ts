import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {
  usersList: any = [];
  managersUsers: any = [];
  standardUsers: any = [];
  userTypesConstants: any = {
    MANAGER_USER: 1,
    STANDARD_USER: 2
  }
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getManagerUsers();
    this.getStandardUsers();
  }

  getUsersList() {
    this.userService.getUsersList().subscribe(
      data => {
        if (data) {
          this.usersList = data;
        }
      }
    );
  }

  getManagerUsers() {
    this.userService.getManagerUsers().subscribe(
      data => {
        if (data) {
          this.managersUsers = data;
        }
      }
    );
  }

  getStandardUsers() {
    this.userService.getStandardUsers().subscribe(
      data => {
        if (data) {
          this.standardUsers = data;
        }
      }
    );
  }
}
