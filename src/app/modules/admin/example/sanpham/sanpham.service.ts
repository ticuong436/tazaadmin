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
import { Sanpham } from './sanpham.types';

@Injectable({
    providedIn: 'root',
})
export class SanphamService {
    private urlApi = 'http://localhost:3000/sanpham';
    private _sanpham: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _sanphamchitiet: BehaviorSubject<any | null> = new BehaviorSubject(
        null
    );
    get sanpham$(): Observable<Sanpham[]> {
        return this._sanpham.asObservable();
    }
    get sanphamchitiet$(): Observable<Sanpham[]> {
        return this._sanphamchitiet.asObservable();
    }
    constructor(private http: HttpClient) {}
    postSanpham(data) {
        return this.sanpham$.pipe(
            take(1),
            switchMap((sanphams) =>
                this.http.post(this.urlApi, data).pipe(
                    map((sanpham) => {
                        this._sanpham.next([sanpham, ...sanphams]);

                        return sanpham;
                    })
                )
            )
        );
    }
    getSanpham() {
        return this.http.get(this.urlApi).pipe(
            map((sanphams) => {
                this._sanpham.next(sanphams);
                return sanphams;
            })
        );
    }
    getSanphamchitiet(id: string): Observable<Sanpham> {
        return this.http.get<Sanpham>(this.urlApi + `/${id}`).pipe(
            map((course) => {
                this._sanphamchitiet.next(course);

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

    deleteSanpham(id){

      return this.sanpham$.pipe(
        take(1),
        switchMap(sanphams=>this.http.delete(this.urlApi+`/${id}`).pipe(map((isDelete => {
          
         const updatesanpham =  sanphams.filter(e => e.id != id);
          
          this._sanpham.next(updatesanpham)
          return isDelete
  
        }))))
      )
  
    }

    updateSanpham(data){
      return this.sanpham$.pipe(
        take(1),
        switchMap(sanphams => this.http.patch(this.urlApi+`/${data.id}`, data).pipe(
            map((upadatesanpham) => {
  
                // Find the index of the updated tag
                const index = sanphams.findIndex(item => item.id === item.id);
  
                // Update the tag
                sanphams[index] = data;
  
                // Update the tags
                this._sanpham.next(sanphams);
  
                // Return the updated tag
                return upadatesanpham;
            })
        ))
    );
      
    }
}
