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

@Injectable({
    providedIn: 'root',
})
export class DonhangService {
    private urlApi = 'http://localhost:3000/donhang';
    private _donhang: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _donhangchitiet: BehaviorSubject<any | null> = new BehaviorSubject(
        null
    );

    get donhang$(): Observable<any[]> {
        return this._donhang.asObservable();
    }
    get donhangchitiet$(): Observable<any[]> {
        return this._donhangchitiet.asObservable();
    }

    constructor(private http: HttpClient) {}


    postDonhang(data) {
        return this.donhang$.pipe(
            take(1),
            switchMap((donhangs) =>
                this.http.post(this.urlApi, data).pipe(
                    map((donhang) => {
                        this._donhang.next([donhang, ...donhangs]);
  
                        return donhang;
                    })
                )
            )
        );
    }

    getDonhang() {
        return this.http.get(this.urlApi).pipe(
            map((donhangs) => {
                console.log(donhangs);

                this._donhang.next(donhangs);
                return donhangs;
            })
        );
    }
    getDonhangchitiet(id: string): Observable<any> {
        return this.http.get<any>(this.urlApi + `/${id}`).pipe(
            map((donhangchitiet) => {
                this._donhangchitiet.next(donhangchitiet);

                return donhangchitiet;
            }),
            switchMap((donhangchitiet) => {
                if (!donhangchitiet) {
                    return throwError(
                        'Could not found course with id of ' + id + '!'
                    );
                }

                return of(donhangchitiet);
            })
        );
    }
    deleteDonhang(id) {
        return this.donhang$.pipe(
            take(1),
            switchMap((donhangs) =>
                this.http.delete(this.urlApi + `/${id}`).pipe(
                    map((isDelete) => {
                        const updatedonhang = donhangs.filter(
                            (e) => e.id != id
                        );

                        this._donhang.next(updatedonhang);
                        return isDelete;
                    })
                )
            )
        );
    }
    updateDonhang(data) {
        return this.donhang$.pipe(
            take(1),
            switchMap((donhangs) =>
                this.http.patch(this.urlApi + `/${data.id}`, data).pipe(
                    map((upadatedonhang) => {
                        // Find the index of the updated tag
                        const index = donhangs.findIndex(
                            (item) => item.id === data.id
                        );

                        // Update the tag
                        donhangs[index] = data;
                        console.log(upadatedonhang);

                        // Update the tags
                        this._donhang.next(donhangs);

                        // Return the updated tag
                        return upadatedonhang;
                    })
                )
            )
        );
    }
}
