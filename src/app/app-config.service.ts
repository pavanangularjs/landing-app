import { Injectable } from '@angular/core';

export const baseURL = 'https://staging.liquorapps.com/Bcapi/api/';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    deviceID = '';
    storeID = 0;
    appID = 0;
    validationMode = '';

    constructor() { }

    getLoginCustomerParams(email?: string, pwd?: string, loginType?: string, sourceId?: string) {
        this.deviceID = localStorage.getItem('deviceId');
        if (this.deviceID === null) {
            this.deviceID = Math.random().toString(36).substring(2);
            localStorage.setItem('deviceId', this.deviceID);
        }
        return {
            AppId: this.appID, // 10275,
            AppVersion: '8.5',
            DeviceId: this.deviceID,
            DeviceType: 'W',
            EmailId: email || '',
            LoginType: loginType || 'B',
            Password: pwd || '',
            StoreId: this.storeID, // 10275,
            SourceId: sourceId || '',
            SessionId: '',
            UserId: '',
            UserIp: ''
        };
    }
}
