import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
} from "@angular/material/dialog";
import {AlertModal} from "../modal.model";



@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [
    MatDialogClose
  ],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css',
})
export class AlertModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : AlertModal
  ) { }

}
