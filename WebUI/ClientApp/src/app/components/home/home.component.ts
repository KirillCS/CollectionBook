import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public constructor(
    private authService: AuthService
  ) { }

  
  public get isAuthenticated() : boolean {
    return this.authService.isAuthenticated();
  }
  
}
