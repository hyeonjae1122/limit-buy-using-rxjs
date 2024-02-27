import {Injectable} from "@angular/core";
import {BehaviorSubject,  Observable, of, Subject} from "rxjs";
import {AlertModal, ConfirmModal} from './modal.model';
import { MatDialog } from "@angular/material/dialog";
import {AlertModalComponent} from "./alert-modal/alert-modal.component";

@Injectable({
  providedIn: 'root',
})
export class ModalRepository {
  confirmV$ = new BehaviorSubject<null | ConfirmModal>(null);
  confirmA$= new Subject<boolean>();
  alertV$= new BehaviorSubject<null | AlertModal>(null);
  alertA$ = new Subject<boolean>();

  constructor(
    public dialog: MatDialog,
  ) {
  }

  showConfirmModal$(confirmModal: ConfirmModal): Observable<boolean> {
    this.dialog.open(AlertModalComponent, {
      data:{
        title: confirmModal.title,
        description: confirmModal.description,
      }
    });
    return of(false);
  }

  showAlertModal$(alertModal: AlertModal): Observable<any> {
     this.dialog.open(AlertModalComponent, {
      data:{
        title: alertModal.title,
        description: alertModal.description,
      },
    });
    return of(false);
  }

}


