import {Injectable} from "@angular/core";
import {catchError, filter, map, merge, Observable, of, switchMap, throwError} from "rxjs";
import {OrderData} from './order/order.component';
import {ModalRepository} from "./modal.repository";
import {AlertModal} from "./modal.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  fakeUserBTCBalance$ = of(100);
  fakeLastPrice$ = of(0.01);
  constructor(
    private modalRepository: ModalRepository
  ) {
  }

  postOrder$(orderData$: Observable<OrderData>) : Observable<any> {

    //mutually exclusive case

    const lessThanOneSatoshi$= orderData$.pipe(
      filter(({price, amount}) => {
        return +price * +amount < 0.0000001;
      }),
      switchMap(() => this.modalRepository.showAlertModal$(
        {title:'ERROR', description:'1 사토시 이상만 주문 가능 합니다.'}
      )),
      switchMap(()=> throwError( ()=>{
        new Error('less than...');
      }) )
    );

    const moreThanOneSatoshi$ = orderData$.pipe(
      filter(({price,amount})=>{
        return +price * +amount >= 0.0000001;
      })
    );

    //
    const userBtcBalance$:Observable<{ btcBalance: number, orderData: OrderData }> = moreThanOneSatoshi$.pipe(
      switchMap((orderData:OrderData)=> {
        return this.fakeUserBTCBalance$.pipe(
          map((btcBalance:number)=>{
            return {
              btcBalance,
              orderData
            }
          })
        );
      })
    )

    const inSufficientFunds$ = userBtcBalance$.pipe(
      filter(({btcBalance,orderData: {price, amount}})=>{
        return btcBalance < +price * +amount;
      }),
      switchMap(()=> this.modalRepository.showAlertModal$(
        {title:'ERROR', description:'BTC가 부족합니다.'}
      )),
      switchMap(()=> throwError( ()=>{
        new Error('insufficient fund');
      }) )
    )

    const sufficientFund$ =userBtcBalance$.pipe(
      filter(({btcBalance,orderData: {price, amount}})=>{
        return btcBalance >= +price * +amount;
      }),
      map(({orderData})=> orderData),
      switchMap((orderData)=>{
        return this.fakeLastPrice$.pipe(
          map((lastPrice: number) => {
            return {lastPrice, orderData};
          }));
      }),
    );

    const warningModal$ = sufficientFund$.pipe(
      filter(({lastPrice,orderData: {price}})=>{
        return (+price - +lastPrice) / lastPrice >= 0.05;
      }),
      map(({orderData})=>orderData),
      switchMap(()=> this.modalRepository.showConfirmModal$(
        {
          title: 'WARNING', description: '구매하시려는 가격이 lastPrice보다 5%이상 큽니다. 그래도 주문하시겠습니까?',
          confirmButtonColor: "",
          confirmButtonText: ""
        }
      ))
    );


    const noWarningModal$:Observable<{ lastPrice:number, orderData:OrderData }> = sufficientFund$.pipe(
      filter(({lastPrice,orderData: {price}})=>{
        return (+price - +lastPrice) / lastPrice < 0.05;
      }),
      map(({orderData})=>orderData),
      switchMap(()=> this.modalRepository.showAlertModal$(
        {
          title: 'ERROR', description: '체결가 갭차이.',
        }
      ))
    )

    return merge(lessThanOneSatoshi$,inSufficientFunds$);
  };
}
