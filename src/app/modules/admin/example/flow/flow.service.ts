import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { Flow } from './flow.types';

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  private urlApi = 'http://localhost:3000/flow';
  private _flow: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _flowchitiet: BehaviorSubject<any | null> = new BehaviorSubject(
      null
  );


  get flow$(): Observable<Flow[]> {
      return this._flow.asObservable();
  }
  get flowchitiet$(): Observable<Flow[]> {
      return this._flowchitiet.asObservable();
  }
  constructor(private http: HttpClient) {}
  postFlow(data) {
      return this.flow$.pipe(
          take(1),
          switchMap((flows) =>
              this.http.post(this.urlApi, data).pipe(
                  map((flow) => {
                      this._flow.next([flow, ...flows]);

                      return flow;
                  })
              )
          )
      );
  }
  getFlow() {
      return this.http.get(this.urlApi).pipe(
          map((flows) => {
            console.log(flows);
            
              this._flow.next(flows);
              return flows;
          })
      );
  }
  getFLowchitiet(id: string): Observable<Flow> {
      return this.http.get<Flow>(this.urlApi + `/${id}`).pipe(
          map((course) => {
              this._flowchitiet.next(course);

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

  deleteFlow(id){

    return this.flow$.pipe(
      take(1),
      switchMap(flows=>this.http.delete(this.urlApi+`/${id}`).pipe(map((isDelete => {
        
       const updateflow =  flows.filter(e => e.id != id);
        
        this._flow.next(updateflow)
        return isDelete

      }))))
    )

  }

  updateFlow(data){
    return this.flow$.pipe(
      take(1),
      switchMap(flows => this.http.patch(this.urlApi+`/${data.id}`, data).pipe(
          map((upadateflow) => {

              // Find the index of the updated tag
              const index = flows.findIndex(item => item.id === item.id);

              // Update the tag
              flows[index] = data;

              // Update the tags
              this._flow.next(flows);

              // Return the updated tag
              return upadateflow;
          })
      ))
  );
    
  }
}
