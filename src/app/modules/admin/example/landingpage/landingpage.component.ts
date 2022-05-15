import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LandingpageService } from './landingpage.service';
import { Landingpage } from './landingpage.types';
import { OfferService } from '../offer/offer.service';
import { SanphamService } from '../sanpham/sanpham.service';
import { Offer } from '../offer/offer.types';
import { v4 as uuidv4 } from 'uuid';
import { FileUploadService } from '../../service/file-upload.service';
import { FileUpload } from '../../models/file-upload.model';
import { map } from 'rxjs';
@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = [
        'id',
        'name',
        'tenPD',
        'idSP',
        'idOffer',
        'image',
        'link',
        'loaiLD',
        'action',
    ];
    landingpageForm: FormGroup;
    offers: Offer[];
    landingpage: Landingpage[];
    selectID;
    traffic = [{ social: 'facebook' }, { social: 'instagram' }];
    products: any;
    selectedFiles?: FileList;
    currentFileUpload?: FileUpload;
    percentage = 0;
    showEdit = false;
    showSubmit= false;
    dataSource: MatTableDataSource<Landingpage>;
    showFiller = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private fb: FormBuilder,
        private offerService: OfferService,
        private landingpageService: LandingpageService,
        private productService: SanphamService,
        private uploadService: FileUploadService
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
        this.landingpageForm.get('idOffer').setValue(item.id);
    }
    getLandingpagechitiet() {
        this.showSubmit = false

        this.landingpageService
            .getLandingpagechitiet(this.selectID)
            .subscribe((res) => {
                this.landingpageForm.get('idOffer').setValue(res.idOffer);
                let tenProduct = this.products.find((x) => x.id == res.idOffer);
                this.landingpageForm.get('tenPD').setValue(tenProduct?.name);

                this.landingpageForm.get('name').setValue(res.name);
                this.landingpageForm.get('link').setValue(res.link);
                this.landingpageForm.get('loaiLD').setValue(res.loaiLD);
            });
    }
    deleteLandingpage() {

        this.landingpageService.deleteLandingpage(this.selectID).subscribe();
        this.resetForm();
        this.landingpageForm.removeControl('tenPD');

    }
    updateLadingpage() {
        this.landingpageForm.addControl('id', new FormControl(this.selectID));
        this.landingpageForm.get('id').setValue(this.selectID);
        this.landingpageService
            .updateLandingpage(this.landingpageForm.value)
            .subscribe();
        this.resetForm();
        this.landingpageForm.removeControl('tenPD');

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
        this.showSubmit = true
        this.showEdit = false
        this.landingpageForm = this.fb.group({
            idOffer: [0],
            name: [''],
            link: [''],
            loaiLD: [''],
            tenPD: [''],
            image: [''],
        });
    }
    onSubmit() {
        this.landingpageForm.removeControl('id');
        this.landingpageService
            .postLandingpage(this.landingpageForm.value)
            .subscribe();
        alert('tạo thành công');
        this.resetForm();
    }
    upload(): void {
        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);
            this.selectedFiles = undefined;
            if (file) {
                this.currentFileUpload = new FileUpload(file);
                this.uploadService
                    .pushFileToStorage(this.currentFileUpload)
                    .subscribe(
                        (percentage) => {
                            this.percentage = Math.round(
                                percentage ? percentage : 0
                            );
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
            }
        }
    }

    ngOnInit(): void {
        this.productService.getSanpham().subscribe();
        this.productService.sanpham$.subscribe((res) => {
            return (this.products = res);
        });
        this.offerService.getoffer().subscribe();
        this.offerService.offer$.subscribe((res) => {
            res?.forEach((v) => {
                return (v.TenSP = this.products.find(
                    (x) => x.id == v.idP
                )?.name);
            });
            return (this.offers = res);
        });
        this.landingpageService.getLandingpage().subscribe();
        this.landingpageService.landingpage$.subscribe((res) => {
            res?.forEach((v) => {

                let a = this.offers?.find((x) => x.id == v.idOffer);
                if (a && a.idP ) {
                    let b = this.products?.find((x) => x.id == a.idP);
                    v.idSP = b?.id;
                    v.TenSP = b?.name;
                }
            });

            this.dataSource = new MatTableDataSource(res);

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            return (this.landingpage = res);
        });
        this.landingpageForm = this.fb.group({
            idOffer: [0],
            name: [''],
            link: [''],
            loaiLD: [''],
            tenPD: [''],
            image: [''],
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
        this.uploadService._thumb$.subscribe((res) => {
            if (res) {
                return this.landingpageForm.get('image').setValue(res);
            }
        });
    }
}
