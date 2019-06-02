import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'markai-gui';
  showMenu = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.showMenu.subscribe(
      (show: boolean) => this.showMenu = show
    );
  }

  ngOnDestroy() {
    this.authService.showMenu.unsubscribe();
  }
}
