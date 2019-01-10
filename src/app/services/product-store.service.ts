import { Injectable } from '@angular/core';
import { Observable, of, throwError, EMPTY, Subject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { switchMap, catchError, retry } from 'rxjs/operators';
// import { Store } from '@ngrx/store';

import { baseUrl, UrlNames } from './url-provider';
// import { CustomerSelectors } from '../state/customer/customer.selector';
import { CustomerLoginSession } from '../models/customer-login-session';
import { BaseRequest } from '../models/base-request';
import { CustomerService } from '../services/customer.service';
/* import { StoreGetHome } from '../state/product-store/product-store.action';
import { ProductGetListRequestPayload } from '../models/product-get-list-request-payload';
import { ProductGetDetailsRequestPayload } from '../models/product-get-details-request-payload';
import { EventGetDetailsRequestPayload } from '../models/event-get-details-request-payload';
import { FavoriteProductUpdateRequestPayload } from '../models/favorite-product-update-payload';
import { AddProductReview } from '../models/add-product-review';
import { UpdateProductReview } from '../models/update-product-review';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { BaseRequest } from '../models/base-request';
import { CartService } from '../services/cart.service'; */

@Injectable()
export class ProductStoreService {
    headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    customerSession: CustomerLoginSession;
    storeList: any;
    /* storeDetails: any;
    couponsList: any;
    storeList: any;
    customerInfo: any;
    isFavoritesUpdated = false; */

    constructor(private http: HttpClient,
        private customerService: CustomerService
       /* private store: Store<CustomerLoginSession>,
        private errorHandler: ErrorHandlerService,
        private cartService: CartService*/ ) {
        /* this.store.select(CustomerSelectors.customerLoginSessionData)
            .subscribe(clsd => {
                if (clsd) {
                    this.customerSession = clsd;
                    this.store.dispatch(new StoreGetHome());
                }
            }); */
    }

    storeGetList(): Observable<any> {

        if (this.storeList) {
            return of(this.storeList);
        }

        return this.http.post<any>(baseUrl + UrlNames.StoreGetList,
            this.getProfileDetailsRequestParams(), { headers: this.headers }).pipe(
            switchMap((res: any) => {
                this.storeList = res;
                return of(res);
            }),
            retry(3),
            catchError((error: any, caught: Observable<any>) => {
                return error;
            })
        );
    }

    private getProfileDetailsRequestParams(): BaseRequest {
        this.customerSession = this.customerService.customerSession;
        if (!this.customerSession) {
            return null;
        }

        return {
            StoreId: this.customerSession.StoreId,
            SessionId: this.customerSession.SessionId,
            UserId: this.customerSession.UserId,
            AppId: this.customerSession.AppId,
            DeviceId: this.customerSession.DeviceId,
            DeviceType: this.customerSession.DeviceType
        };
    }
}
