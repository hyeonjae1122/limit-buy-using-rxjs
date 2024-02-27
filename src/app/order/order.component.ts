import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, combineLatest, combineLatestAll, map, Observable, Subject} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {OrderService} from "../order.service";

export interface OrderData {
  price: string;
  amount: string;
}
@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{
  priceA$ = new Subject<string>();
  amountA$ = new Subject<string>();
  placeOrderA$ = new Subject<OrderData>();
  totalOrderAmountV$ = new BehaviorSubject<string>('0');
  estTotalV$ = new BehaviorSubject<string>('0')

  buyButtonDisabledV$ = new BehaviorSubject<boolean>(false);
  orderData:OrderData = {price: '0', amount:'0'};

  isValidAmount$ : Observable<boolean>;
  totalOrderAmount$:Observable<string>;
  constructor(
    private orderService: OrderService
  ) {
    this.isValidAmount$ = this.amountA$.pipe(
      map((amountValue)=> {
        return +amountValue >0;
      })
    );

    this.totalOrderAmount$ = combineLatest({price: this.priceA$, amount: this.amountA$}).pipe(
      map((item)=>{
        const total = (+item.price) * (+item.amount);
        return total.toString();
      })
    )

  }

  ngOnInit() {
    this.priceA$.subscribe(
      (priceValue: string)=>{
      this.orderData.price = priceValue;
    });
    this.amountA$.subscribe(
      (amountValue: string)=>{
        this.orderData.amount= amountValue;
        this.estTotalV$.next(amountValue);
    });
    this.isValidAmount$.subscribe(
      (isValid: boolean)=>{
        this.buyButtonDisabledV$.next(!isValid);
    });
    this.totalOrderAmount$.subscribe((totalOrderAmount:string)=>{
      this.totalOrderAmountV$.next(totalOrderAmount);
    });
    this.orderService.postOrder$(this.placeOrderA$).pipe(
      catchError((err, source$) => {
        console.log('error');
        return source$;
      })
    ).subscribe((data: any) => {
      console.log('success',data);
    });

  }
}
