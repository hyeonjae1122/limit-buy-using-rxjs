import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AlertModalComponent} from "./alert-modal/alert-modal.component";
import {ConfirmModalComponent} from "./confirm-modal/confirm-modal.component";
import {OrderComponent} from "./order/order.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertModalComponent, ConfirmModalComponent, OrderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {  constructor(
  ) {
  }


}
