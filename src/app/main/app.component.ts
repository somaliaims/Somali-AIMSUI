import { Component } from '@angular/core';
import { SecurityHelperService } from '../services/security-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aims-ui';
  isLoggedIn: boolean = false;

  constructor(private securityService: SecurityHelperService) {
    this.isLoggedIn = (localStorage.getItem('isLoggedIn') == '1');
  }
}
