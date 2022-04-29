import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DanhmucService } from './danhmuc.service';
import { Danhmuc } from './danhmuc.types';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUpload } from '../../models/file-upload.model';
import { FileUploadService } from '../../service/file-upload.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-danhmuc',
    templateUrl: './danhmuc.component.html',
    styleUrls: ['./danhmuc.component.scss'],
})
export class DanhmucComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = ['id', 'name', 'image', 'action'];
    danhmucForm: FormGroup;
    danhmuc: Danhmuc[];
    selectID;
    selectedFiles?: FileList;
    currentFileUpload?: FileUpload;
    percentage = 0;
    showEdit = false;
    dataSource: MatTableDataSource<Danhmuc>;
    showFiller = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private danhmucService: DanhmucService,
        private fb: FormBuilder,
        private uploadService: FileUploadService
    ) {
        // Create 100 users
        // const users = Array.from({ length: 10 }, (_, k) =>
        //     createNewUser(k + 1)
        // );
        // Assign the data to the data source for the table to render
    }

    ngAfterViewInit(): void {
       
    }
    selectId(id) {
        this.selectID = id;
        this.showEdit = true;
    }
    selectFile(event: any): void {
        this.selectedFiles = event.target.files;
    }
    onSelect(item) {
        this.danhmucForm.addControl('parentId', new FormControl(item.id));
        this.danhmucForm.get('parentId').setValue(item.id);
    }
    getDanhmucchitiet() {
        this.danhmucService
            .getDanhmucchitiet(this.selectID)
            .subscribe((res) => {
              
                this.danhmucForm.get('name').setValue(res.name);
                if (res.parentId) {
                    this.danhmucForm.get('parentId').setValue(res.parentId);
                    let danhmucparent = this.danhmuc.filter((x) => {
                        return x.id == res.parentId;
                    });
                    this.danhmucForm.addControl('danhmucCha', new FormControl(''));

                    this.danhmucForm.get('danhmucCha').setValue(danhmucparent[0].name);


                }
            });
    }
    deleteDanhmuc() {
        this.danhmucService.deleteDanhmuc(this.selectID).subscribe();
        this.resetForm();
    }
    updateDanhmuc() {
        this.danhmucForm.addControl('id', new FormControl(this.selectID));
        this.danhmucForm.get('id').setValue(this.selectID);
        this.danhmucService.updateDanhmuc(this.danhmucForm.value).subscribe();
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
        this.danhmucForm = this.fb.group({
            name: [''],
            image: [''],
            parentId: [0],
        });
    }
    onSubmit() {
        this.danhmucForm.removeControl('id');
        this.danhmucService.postDanhmuc(this.danhmucForm.value).subscribe();
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
            
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            return (this.danhmuc = res);
        });
        this.danhmucForm = this.fb.group({
            name: [''],
            parentId: [0],
            img: [''],
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
                return this.danhmucForm.get('image').setValue(res);
            }
        });
    }
}
