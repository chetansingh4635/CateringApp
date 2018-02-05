import { Component, OnInit } from '@angular/core';
import { LocalStorage } from './services/localStorage.service';
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _router: Router) {
  }

  ngOnInit() {
    // let authStore = new LocalStorage(environment.localStorageKeys.TOKEN).value;

    // if (!(authStore && authStore.token)) {
    //    LocalStorage.clear();
    //   this._router.navigateByUrl('/login');
    // }
  }
}
