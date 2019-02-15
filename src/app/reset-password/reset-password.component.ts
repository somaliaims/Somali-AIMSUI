import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { ActivatedRoute, Router } from '@angular/router/src';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  model: any = { password: null, confirmPassword: null, token: null };
  isError: boolean = false;
  errorMessage: string = '';
  isInfo: boolean = false;
  infoMessage: string = '';

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    var token = this.route.snapshot.params["{token}"];
    if (token != null) {
      this.model.token = token;
    }
  }

  resetPassword() {
    this.userService.resetPassword(this.model).subscribe(
      data => {
        if (data.success) {
          this.infoMessage = '';
          this.isInfo = true;
          setTimeout(() => {
            this.router.navigateByUrl('login');
            location.reload();
          }, 2000);
        }
      },
      error => {
        this.errorMessage = error;
        this.isError = true;
      }
    )
  }

}
