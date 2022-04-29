import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { Offer } from './offer.types';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private urlApi = 'http://localhost:3000/offer';
  private _offer: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _offerchitiet: BehaviorSubject<any | null> = new BehaviorSubject(
      null
  );
  get offer$(): Observable<Offer[]> {
      return this._offer.asObservable();
  }
  get offerchitiet$(): Observable<Offer[]> {
      return this._offerchitiet.asObservable();
  }
  constructor(private http: HttpClient) {}
  postoffer(data) {
      return this.offer$.pipe(
          take(1),
          switchMap((offers) =>
              this.http.post(this.urlApi, data).pipe(
                  map((offer) => {
                      this._offer.next([offer, ...offers]);

                      return offer;
                  })
              )
          )
      );
  }
  getoffer() {
      return this.http.get(this.urlApi).pipe(
          map((offers) => {
            console.log(offers);
            
              this._offer.next(offers);
              return offers;
          })
      );
  }
  getofferchitiet(id: string): Observable<Offer> {
      return this.http.get<Offer>(this.urlApi + `/${id}`).pipe(
          map((course) => {
              this._offerchitiet.next(course);

              return course;
          }),
          switchMap((course) => {
              if (!course) {
                  return throwError(
                      'Could not found course with id of ' + id + '!'
                  );
              }

              return of(course);
          })
      );
  }

  deleteoffer(id){

    return this.offer$.pipe(
      take(1),
      switchMap(offers=>this.http.delete(this.urlApi+`/${id}`).pipe(map((isDelete => {
        
       const updateoffer =  offers.filter(e => e.id != id);
        
        this._offer.next(updateoffer)
        return isDelete

      }))))
    )

  }

  updateoffer(data){
    return this.offer$.pipe(
      take(1),
      switchMap(offers => this.http.patch(this.urlApi+`/${data.id}`, data).pipe(
          map((upadateoffer) => {

              // Find the index of the updated tag
              const index = offers.findIndex(item => item.id === item.id);

              // Update the tag
              offers[index] = data;

              // Update the tags
              this._offer.next(offers);

              // Return the updated tag
              return upadateoffer;
          })
      ))
  );
    
  }
}
