import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    map,
    Observable,
    of,
    switchMap,
    take,
    throwError,
} from 'rxjs';
import { Danhmuc } from './danhmuc.types';

@Injectable({
    providedIn: 'root',
})
export class DanhmucService {
    private urlApi = 'http://localhost:3000/danhmuc';
    private _danhmuc: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _danhmucchitiet: BehaviorSubject<any | null> = new BehaviorSubject(
        null
    );
    get danhmuc$(): Observable<Danhmuc[]> {
        return this._danhmuc.asObservable();
    }
    get danhmucchitiet$(): Observable<Danhmuc[]> {
        return this._danhmucchitiet.asObservable();
    }
    constructor(private http: HttpClient) {}
    postDanhmuc(data) {
        return this.danhmuc$.pipe(
            take(1),
            switchMap((danhmucs) =>
                this.http.post(this.urlApi, data).pipe(
                    map((danhmuc) => {
                        this._danhmuc.next([danhmuc, ...danhmucs]);

                        return danhmuc;
                    })
                )
            )
        );
    }
    getDanhmuc() {
        return this.http.get(this.urlApi).pipe(
            map((danhmucs) => {
                this._danhmuc.next(danhmucs);
                return danhmucs;
            })
        );
    }
    getDanhmucchitiet(id: string): Observable<Danhmuc> {
        return this.http.get<Danhmuc>(this.urlApi + `/${id}`).pipe(
            map((course) => {
                this._danhmucchitiet.next(course);

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

    deleteDanhmuc(id){

      return this.danhmuc$.pipe(
        take(1),
        switchMap(danhmucs=>this.http.delete(this.urlApi+`/${id}`).pipe(map((isDelete => {
          
         const updateDanhmuc =  danhmucs.filter(e => e.id != id);
          
          this._danhmuc.next(updateDanhmuc)
          return isDelete
  
        }))))
      )
  
    }

    updateDanhmuc(data){
      return this.danhmuc$.pipe(
        take(1),
        switchMap(danhmucs => this.http.patch(this.urlApi+`/${data.id}`, data).pipe(
            map((upadatedanhmuc) => {
  
                // Find the index of the updated tag
                const index = danhmucs.findIndex(item => item.id === item.id);
  
                // Update the tag
                danhmucs[index] = data;
  
                // Update the tags
                this._danhmuc.next(danhmucs);
  
                // Return the updated tag
                return upadatedanhmuc;
            })
        ))
    );
      
    }
}
