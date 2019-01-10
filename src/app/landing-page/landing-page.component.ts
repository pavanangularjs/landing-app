import { Component, OnInit } from '@angular/core';
import { ProductStoreService } from '../services/product-store.service';
import { CustomerService } from '../services/customer.service';
import { AppConfigService } from '../app-config.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  stores: any;
  searchText: string;
  tempStores: any;
  isSearchClicked = false;
  topCities = [];
  searchBy = 'store';
  placeholderText = 'Search by City, Zip Code or Name';

  constructor(private storeService: ProductStoreService,
    private customerService: CustomerService,
    private appConfig: AppConfigService) { }

  ngOnInit() {
    this.customerService.loginCustomer(this.appConfig.getLoginCustomerParams())
    .subscribe(data => {
      if (data) {
        this.getStoreList();
      }
    });

  }

  onSerchByChange() {
    if (this.searchBy === 'drink') {
      this.searchBy = 'store';
      this.placeholderText = 'Search by City, Zip Code or Name';
    } else {
      this.searchBy = 'drink';
      this.placeholderText = 'Find Your Drink';
    }
  }
  getStoreList() {
    // this.progressBarService.show();
    this.storeService.storeGetList().subscribe(data => {
      if (data && data.ListStore) {
        this.stores = data.ListStore;
        // this.progressBarService.hide();

        this.getTopStores();
      }
    });
  }

  filterBySearchText() {

    if (!this.searchText) {
      return;
    }
    if (this.stores && !this.tempStores) {
      this.tempStores = this.stores.map(obj => {
        const rObj = {
          'StoreId' : obj.StoreId,
          'Address1': obj.Address1,
          'Address2': obj.Address2,
          'City': obj.City,
          'Location' : obj.Location,
          'Phone': obj.Phone,
          'State': obj.State,
          'ContactNo': obj.ContactNo,
          'StoreName': obj.StoreName,
          'Zip': obj.Zip
        };
        return rObj;
      });
    }
   // console.log(this.searchText);
   this.isSearchClicked = true;
    this.stores = this.tempStores;
    this.stores = this.stores.filter(item =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
          .includes(this.searchText.toLowerCase()))
    );
  }

  getTopStores() {
    this.topCities = this.stores.map(item => item.City)
    .filter((value, index, self) => self.indexOf(value) === index);
  }
}
