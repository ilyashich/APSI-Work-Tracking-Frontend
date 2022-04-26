import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ContextProvider {

  private apiContext = new BehaviorSubject('ALL');
  private apiContexts = new BehaviorSubject([]);
  private apiContextsById = new BehaviorSubject({});

  public setApiContext(selectedContext: string) {
    this.apiContext.next(selectedContext);
  }

  public setApiContexts(contexts: string[]) {
    this.apiContexts.next(contexts);
  }

  public setApiContextsById(contexts: {}) {
    this.apiContextsById.next(contexts);
  }

  public getApiContext() {
    return this.apiContext;
  }

  public getApiContexts() {
    return this.apiContexts;
  }

  public getApiContextsById() {
    return this.apiContextsById;
  }

}
