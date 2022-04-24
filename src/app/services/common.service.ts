import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable()
export class CommonService {

  constructor() { }

  public canAuthViewProceed(self: any) {

  }

  public static strToBoolean(value: any) {
    switch (value) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
        return true;
      default:
        return false;
    }
  }


  public handleIncommingApiData
    (itemData: Observable<any>, self: any, additionalData: any, successAction: any, errorAction: any) {
    if (itemData === undefined) {
      successAction(undefined, additionalData, self);
      return;
    }
    // =========================================================================
    itemData
      .subscribe(
        data => {
          let error;
          let item;
          // ========================
          if (data === undefined) {
            return;
          }
          if (data.incommingData !== undefined) {
            if (data.incommingData.value !== undefined) {
              error = data.incommingData.value.error;
              item = data.incommingData.value.item;
            } else {
              error = data.incommingData.error;
              item = data.incommingData.item;
            }
          } else if (data.value !== undefined) {
            error = data.value.error;
            item = data.value.item;
          } else {
            error = data.error;
            item = data.item;
          }
          // ========================
          if (error) {
            this.handleHttpError(error, errorAction, self);
            return;
          }
          // ===================
          successAction(item, additionalData, self);
        },
    );
  }

  async asyncHandleIncommingApiData(
    itemData: Observable<any>, self: any, additionalData: any, successAction: any, errorAction: any) {
    const data = await itemData.toPromise();
    // ========================
    let error;
    let item;
    // ========================
    if (data.incommingData !== undefined) {
      if (data.incommingData.value !== undefined) {
        error = data.incommingData.value.error;
        item = data.incommingData.value.item;
      } else {
        error = data.incommingData.error;
        item = data.incommingData.item;
      }
    } else if (data.value !== undefined) {
      error = data.value.error;
      item = data.value.item;
    } else {
      error = data.error;
      item = data.item;
    }
    // ========================
    if (error !== undefined) {
      this.handleHttpError(error, errorAction, self);
      return;
    }
    // ===================
    successAction(item, additionalData, self);
  }

  public handleHttpError(error: any, errorAction: ((arg0: any, arg1: any) => void) | undefined, self: any) {
    if (errorAction !== undefined) {
      errorAction(error, self);
      return;
    }
    this.handleHttpErrorWithoutRedirect(error);
  }

  public handleHttpErrorWithoutRedirect(error: any) {
    // empty
  }

  public handleHttpErrorWithRedirect(error: any) {
    // empty
  }

  // ###########################################################################
  // snack bar
  // ###########################################################################

  public showSnackBar(message: string): void {
    // empty
  }

}
