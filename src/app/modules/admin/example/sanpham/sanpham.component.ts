import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SanphamService } from './sanpham.service';
import { Sanpham } from './sanpham.types';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUpload } from '../../models/file-upload.model';
import { FileUploadService } from '../../service/file-upload.service';
import { map } from 'rxjs';
import { DanhmucService } from '../danhmuc/danhmuc.service';

@Component({
    selector: 'app-sanpham',
    templateUrl: './sanpham.component.html',
    styleUrls: ['./sanpham.component.scss'],
})
export class SanphamComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = [
        'id',
        'danhmuc',
        'name',
        'des',
        'status',
        'price',
        'slug',
        'image',
        'action',
    ];
    dataSource: MatTableDataSource<Sanpham>;
    showFiller = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    productForm: FormGroup;
    products: Sanpham[];
    selectID;
    selectedFiles?: FileList;
    currentFileUpload?: FileUpload;
    percentage = 0;
    danhmuc: any;
    showEdit = false;
    showSubmit = false;

    constructor(
        private sanphamService: SanphamService,
        private fb: FormBuilder,
        private uploadService: FileUploadService,
        private danhmucService: DanhmucService
    ) {
        // Create 100 users
        // const users = Array.from({ length: 10 }, (_, k) =>
        //     createNewUser(k + 1)
        // );
        // Assign the data to the data source for the table to render
    }
    ngAfterViewInit() {
    
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    selectId(id) {
        this.selectID = id;
        this.showEdit = true;
    }
    selectFile(event: any): void {
        this.selectedFiles = event.target.files;
    }
    onSelect(item) {
        this.productForm.addControl('idDM', new FormControl(item.id));
        this.productForm.get('idDM').setValue(item.id);
    }
    getSanphamchitiet() {
        this.showSubmit = false

        this.sanphamService
            .getSanphamchitiet(this.selectID)
            .subscribe((res) => {
                let danhmucdetail = this.danhmuc.find((x) => x.id == res.idDM);

                this.productForm.get('danhmuc').setValue(danhmucdetail.name);

                this.productForm.get('name').setValue(res.name);
                this.productForm.get('des').setValue(res.des);
                this.productForm.get('status').setValue(res.status);
                this.productForm.get('slug').setValue(res.slug);
                this.productForm.get('image').setValue(res.image);

                this.productForm.get('price').setValue(res.price);
                this.productForm.get('idDM').setValue(res.idDM);
            });
    }
    deleteSanpham() {
        this.sanphamService.deleteSanpham(this.selectID).subscribe();

        this.resetForm();
        this.productForm.removeControl('danhmuc');

    }
    updateSanpham() {
        this.productForm.addControl('id', new FormControl(this.selectID));
        this.productForm.get('id').setValue(this.selectID);
        
        this.sanphamService.updateSanpham(this.productForm.value).subscribe();
        this.resetForm();
        this.productForm.removeControl('danhmuc');

        this.ngOnInit();
    }

    resetForm() {
        this.productForm = this.fb.group({
            name: [''],
            des: [''],
            danhmuc: [''],
            status: [''],
            slug: [''],
            price: [0],
            image: [''],
        });
        this.showSubmit = true
        this.showEdit = false
      
    }
    onSubmit() {
        this.productForm.removeControl('id');
        this.productForm.removeControl('danhmuc');
        this.sanphamService.postSanpham(this.productForm.value).subscribe();
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
        this.danhmucService.getDanhmuc().subscribe();
        this.danhmucService.danhmuc$.subscribe((res) => {
            return (this.danhmuc = res);
        })
        this.sanphamService.getSanpham().subscribe();
        this.sanphamService.sanpham$.subscribe((res) => {
            res?.forEach((v) => {
                v.TenDM = this.danhmuc?.find((x) => x.id == v.idDM)?.name;
            });
            if (res) {
                this.dataSource = new MatTableDataSource(res);
            }
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            return (this.products = res);
        });
        this.productForm = this.fb.group({
            name: [''],
            des: [''],
            danhmuc: [''],
            status: [''],
            slug: [''],
            price: [0],
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
                
                return fileUploads;
            });
            this.uploadService._thumb$.subscribe((res) => {
                if (res) {
                    return this.productForm.get('image').setValue(res);
                }
            });
    }
}
