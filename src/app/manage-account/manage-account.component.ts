import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';

@Component({
  selector: 'manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {
  model = { userId: null, password: null };
  dModel = { email: null, password: null };
  tab: string = 'password';

  constructor(private userService: UserService, private router: Router) { }
  //Overlay UI blocker
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit() {
  }

  showPasswordTab() {
    this.tab = 'password';
    return false;
  }

  showAccountTab() {
    this.tab = 'account';
    return false;
  }

  changePassword() {
    this.blockUI.start('Changing Password...');
    this.userService.editUserPassword(this.model.userId, this.model.password).subscribe(
      data => {
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
      }
    )
  }

  deleteAccount() {
    this.userService.deleteUserAccount(this.dModel.email, this.dModel.password).subscribe(
      data => {
        this.router.navigateByUrl('home');
      },
      error => {
        
      }
    )
  }



}
