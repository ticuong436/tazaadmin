import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { Landingpage } from './Landingpage.types';

@Injectable({
  providedIn: 'root'
})
export class LandingpageService {

  private urlApi = 'http://localhost:3000/landingpage';
  private _landingpage: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _landingpagechitiet: BehaviorSubject<any | null> = new BehaviorSubject(
      null
  );


  get landingpage$(): Observable<Landingpage[]> {
      return this._landingpage.asObservable();
  }
  get landingpagechitiet$(): Observable<Landingpage[]> {
      return this._landingpagechitiet.asObservable();
  }
  constructor(private http: HttpClient) {}
  postLandingpage(data) {
      return this.landingpage$.pipe(
          take(1),
          switchMap((landingpages) =>
              this.http.post(this.urlApi, data).pipe(
                  map((landingpage) => {
                      this._landingpage.next([landingpage, ...landingpages]);

                      return landingpage;
                  })
              )
          )
      );
  }
  getLandingpage() {
      return this.http.get(this.urlApi).pipe(
          map((landingpages) => {
            console.log(landingpages);
            
              this._landingpage.next(landingpages);
              return landingpages;
          })
      );
  }
  getLandingpagechitiet(id: string): Observable<Landingpage> {
      return this.http.get<Landingpage>(this.urlApi + `/${id}`).pipe(
          map((course) => {
              this._landingpagechitiet.next(course);

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

  deleteLandingpage(id){

    return this.landingpage$.pipe(
      take(1),
      switchMap(landingpages=>this.http.delete(this.urlApi+`/${id}`).pipe(map((isDelete => {
        
       const updatelandingpage =  landingpages.filter(e => e.id != id);
        
        this._landingpage.next(updatelandingpage)
        return isDelete

      }))))
    )

  }

  updateLandingpage(data){
    return this.landingpage$.pipe(
      take(1),
      switchMap(landingpages => this.http.patch(this.urlApi+`/${data.id}`, data).pipe(
          map((upadatelandingpage) => {

              // Find the index of the updated tag
              const index = landingpages.findIndex(item => item.id === item.id);

              // Update the tag
              landingpages[index] = data;

              // Update the tags
              this._landingpage.next(landingpages);

              // Return the updated tag
              return upadatelandingpage;
          })
      ))
  );
    
  }
}
