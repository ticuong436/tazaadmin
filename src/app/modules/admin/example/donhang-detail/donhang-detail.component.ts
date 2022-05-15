import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DonhangService } from '../donhang/donhang.service';
import { ActivatedRoute } from '@angular/router';
import { SanphamService } from '../sanpham/sanpham.service';
import { Sanpham } from '../sanpham/sanpham.types';
import { map } from 'rxjs';
@Component({
    selector: 'app-donhang-detail',
    templateUrl: './donhang-detail.component.html',
    styleUrls: ['./donhang-detail.component.scss'],
})
export class DonhangDetailComponent implements OnInit {
    trangthai: any[] = [
        { id: 1, title: 'New' },
        { id: 2, title: 'Đơn Rác' },
        { id: 3, title: 'Trùng Đơn' },
        { id: 4, title: 'Nhận Đơn' },
        { id: 5, title: 'Hủy Đơn' },
    ];
    isOpen = false;
    isOpenSP = false;

    displayedColumns: string[] = [
        'id',
        'name',
        'soluong',
        'price',
        'status',
        // 'diachi',
        'total',
        'action',
    ];
    triggerOrigin;
    triggerOriginSP;

    selectRow;
    selectID;
    selectedFiles?: FileList;
    percentage = 0;
    showEdit = false;
    showSubmit = false;
    donhangchitiet;
    donhangForm;
    sanpham: Sanpham[];
    dataSource: MatTableDataSource<any>;
    showFiller = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private donhangService: DonhangService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private sanphamService: SanphamService
    ) {
       
    }
    onSelect(item) {
        this.selectRow.trangthai = item.id;
        this.isOpen = false;
        this.donhangService.updateDonhang(this.selectRow).subscribe();
    }
    onSelectSP(item) {
        this.isOpenSP = false;
        this.selectRow.TenSP = item.name;
        this.donhangService.updateDonhang(this.selectRow).subscribe();
    }
    toggle(trigger: any, row) {
        console.log(row);

        this.selectRow = row;
        this.triggerOrigin = trigger;
        this.isOpen = !this.isOpen;
    }
    toggleSP(trigger: any, row) {
        this.selectRow = row;
        this.triggerOriginSP = trigger;
        this.isOpenSP = !this.isOpenSP;
    }
    ngAfterViewInit(): void {}
    selectId(id) {
        this.selectID = id;
        this.showEdit = true;
    }
    selectFile(event: any): void {
        this.selectedFiles = event.target.files;
    }

    getDanhmucchitiet() {
        this.showSubmit = false;
        if (this.selectID) {
        }
    }
    updateQuantity(row, e) {
        row.soluong = (e.target as HTMLInputElement).value;
       
        this.donhangService.updateDonhang(row).subscribe();
    }
    updatePrice(row, e) {
        row.price = (e.target as HTMLInputElement).value;
        this.donhangService.updateDonhang(row).subscribe();
    }
    deleteDonhang(row) {
        this.donhangService.deleteDonhang(row.id).subscribe();
    }
    themdonhang() {
        this.donhangService.postDonhang(this.donhangForm.value).subscribe();
        this.ngOnInit();
    }
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    resetForm() {
        this.showSubmit = true;
        this.showEdit = false;
    }

    ngOnInit(): void {
        this.donhangService
            .getDonhangchitiet(this.route.snapshot.params.id)
            .subscribe((res) => {
                if (res) {
                    this.donhangchitiet = res;
                    this.donhangForm.get('hovaten').setValue(res.hovaten);
                    this.donhangForm.get('phone').setValue(res.phone);
                    this.donhangForm.get('idUser').setValue(res.idUser);
                }
            });
        this.donhangService.getDonhang().subscribe();
        this.donhangService.donhang$
            .pipe(
                map(
                    (arr: any) =>
                        arr &&
                        arr.length &&
                        arr.filter((r) => {
                            if (this.donhangchitiet) {
                                return r.idUser == this.donhangchitiet.idUser;
                            }
                        })
                )
            )
            .subscribe((result) => {
                if (result) {
                    console.log(result);
                    return (this.dataSource = new MatTableDataSource(result));
                }
            });
        this.sanphamService.getSanpham().subscribe();
        this.sanphamService.sanpham$.subscribe((res) => (this.sanpham = res));

        this.donhangForm = this.fb.group({
            pub: [''],
            hovaten: [''],
            phone: [''],
            TenSP: [''],
            price: [''],
            soluong: [1],
            trangthai: [1],
            idUser: [0],
        });
    }
}
