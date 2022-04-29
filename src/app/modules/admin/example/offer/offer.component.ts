import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUpload } from '../../models/file-upload.model';
import { FileUploadService } from '../../service/file-upload.service';
import { map } from 'rxjs';
import { DanhmucService } from '../danhmuc/danhmuc.service';
import { SanphamService } from '../sanpham/sanpham.service';
import { OfferService } from './offer.service';
import { Offer } from './offer.types';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-sanpham',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.scss'],
})
export class OfferComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = [
        'id',
        'product',
        'categories',
        'vertical',
        'geo',
        'target',
        'promotion',
        'payout',
        'action',
    ];
    offerForm: FormGroup;
    offers: Offer[];
    products: any = [];
    selectID;
    selectedFiles?: FileList;
    currentFileUpload?: FileUpload;
    percentage = 0;
    danhmuc: any;
    showEdit = false;
    dataSource: MatTableDataSource<Offer>;
    showFiller = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private sanphamService: SanphamService,
        private fb: FormBuilder,
        private uploadService: FileUploadService,
        private danhmucService: DanhmucService,
        private offService: OfferService,
        private cb: CurrencyPipe
    ) {
        // Create 100 users
        // const users = Array.from({ length: 10 }, (_, k) =>
        //     createNewUser(k + 1)
        // );
        // Assign the data to the data source for the table to render
    }

    ngAfterViewInit(): void {}
    selectId(id) {
        this.selectID = id;
        this.showEdit = true;
    }
    selectFile(event: any): void {
        this.selectedFiles = event.target.files;
    }
    onSelect(item) {
        this.offerForm.addControl('idP', new FormControl(item.id));
        this.offerForm.get('idP').setValue(item.id);
    }
    getOfferchitiet() {
        this.offService.getofferchitiet(this.selectID).subscribe((res) => {
            this.offerForm.get('idP').setValue(res.idP);
            let tenProduct = this.products.find((x) => x.id == res.idP)?.name;
            this.offerForm.get('tenProduct').setValue(tenProduct);

            this.offerForm.get('vertical').setValue(res.vertical);
            this.offerForm.get('geo').setValue(res.geo);
            this.offerForm.get('target').setValue(res.target);
            this.offerForm.get('promotion').setValue(res.promotion);
            this.offerForm.get('payout').setValue(res.payout);
        });
    }
    deleteOffer() {
        this.offService.deleteoffer(this.selectID).subscribe();
        this.resetForm();
    }
    updateOffer() {
        this.offerForm.addControl('id', new FormControl(this.selectID));
        this.offerForm.get('id').setValue(this.selectID);
        this.offerForm.removeControl('tenProduct');
        this.offService.updateoffer(this.offerForm.value).subscribe();
        this.resetForm();
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
        this.offerForm = this.fb.group({
            idP: [0],
            vertical: [''],
            geo: [''],
            target: [''],
            promotion: [0],
            payout: [0],
        });
    }
    onSubmit() {
        this.offerForm.removeControl('id');
        this.offerForm.removeControl('tenProduct');

        this.offService.postoffer(this.offerForm.value).subscribe();
        alert('tạo thành công');
        this.resetForm();
    }

    ngOnInit(): void {
        this.sanphamService
            .getSanpham()
            .subscribe((res) => (this.products = res));

        this.danhmucService
            .getDanhmuc()
            .subscribe((res) => (this.danhmuc = res));

        this.offService.getoffer().subscribe();
        this.offService.offer$.subscribe((res) => {
            res?.forEach((v) => {
                let a = this.products.find((x) => x.id == v.idP);
                let b = this.danhmuc.find((x) => x.id == a?.idDM);
                v.TenSP = a?.name;
                v.TenDM = b?.name;
            });
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            return (this.offers = res);
        });
        this.offerForm = this.fb.group({
            idP: [0],
            tenProduct: [''],
            vertical: [''],
            geo: [''],
            target: [''],
            promotion: [0],
            payout: [0],
        });

        this.uploadService
            .getFiles(1)
            .snapshotChanges()
            .pipe(
                map((changes) =>
                    // store the key
                    changes.map((c) => ({
                        key: c.payload.key,
                        ...c.payload.val(),
                    }))
                )
            )
            .subscribe((fileUploads) => {
                // this.fileUploads = fileUploads.reverse();
                // console.log(fileUploads);
                return fileUploads;
            });

        this.danhmucService.getDanhmuc().subscribe((res) => {
            return (this.danhmuc = res);
        });
        this.sanphamService.getSanpham().subscribe((res) => {
            return (this.products = res);
        });
    }
}
