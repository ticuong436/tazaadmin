import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FlowService } from './flow.service';
import { Flow } from './flow.types';
import {LandingpageService} from '../landingpage/landingpage.service'
import { Landingpage } from '../landingpage/landingpage.types';

import { OfferService } from '../offer/offer.service';
import { SanphamService } from '../sanpham/sanpham.service';
import { Offer } from '../offer/offer.types';
import { v4 as uuidv4 } from 'uuid';
@Component({
    selector: 'app-flow',
    templateUrl: './flow.component.html',
    styleUrls: ['./flow.component.scss'],
})
export class FlowComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = [
        'id',
        'code',
        'name',
        'product',
        'link',
        'createAt',
        'action',
    ];
    flowForm: FormGroup;
    offers: Offer[];
    flow: Flow[];
    landingpage: Landingpage[];
    selectID;
    traffic = [{ social: 'facebook' }, { social: 'instagram' }];
    products: any;
    selectedFiles?: FileList;
    link='';
    percentage = 0;
    showEdit = false;
    dataSource: MatTableDataSource<Flow>;
    showFiller = false;
    showSubmit = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private fb: FormBuilder,
        private offerService: OfferService,
        private flowService: FlowService,
        private productService: SanphamService,
        private ladingpageService: LandingpageService
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
        this.flowForm.get('idOffer').setValue(item.id);
        this.ladingpageService.landingpage$.subscribe(res=>{
           this.landingpage =  res.filter(x=> x.idOffer == item.id)
           console.log(this.landingpage);
           
        })
    }
    onSelectLink(item){

        this.link = item.link
    }
    getFlowchitiet() {
        this.showSubmit = false

        this.flowService.getFLowchitiet(this.selectID).subscribe((res) => {
            this.flowForm.get('idOffer').setValue(res.idOffer);
            let tenProduct = this.products?.find(
                (x) => x.id == res.idOffer
            );
            // let link = this.landingpage.find(x => x.idOffer)
            this.flowForm.get('TenSP').setValue(tenProduct?.name);
            this.flowForm.get('name').setValue(res.name);
            this.flowForm.get('link').setValue(res.link);
            this.flowForm.get('landingpage').setValue(res.landingpage);

            this.flowForm.get('traffic').setValue(res.traffic);
        });
    }
    deleteFlow() {
        this.flowService.deleteFlow(this.selectID).subscribe();
        this.resetForm();
        this.flowForm.removeControl('TenSP');

    }
    updateFlow() {
        this.flowForm.addControl('id', new FormControl(this.selectID));
        this.flowForm.get('id').setValue(this.selectID);
        this.flowService.updateFlow(this.flowForm.value).subscribe();
        this.resetForm();
        this.flowForm.removeControl('TenSP');

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
        this.flowForm = this.fb.group({
            idOffer: [0],
            name: [''],
            landingpage: [''],
            traffic: [''],
            link: [''],
        });
    }
    onSubmit() {

        
        var today = new Date();

        var date =
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1) +
            '-' +
            today.getDate();

        var time =
            today.getHours() +
            ':' +
            today.getMinutes() +
            ':' +
            today.getSeconds();

        var dateTime = date + ' ' + time;
        this.flowForm.removeControl('id');
        this.flowForm.removeControl('TenSP');
        this.flowForm.addControl('code', new FormControl(''));
        let code = uuidv4().substring(0, 8)
        this.flowForm.get('code').setValue(code);
        this.flowForm.get('link').setValue(`${this.link}#${code}`);
        this.flowForm.addControl('createAt', new FormControl(''));
        this.flowForm.get('createAt').setValue(dateTime);

        this.flowService.postFlow(this.flowForm.value).subscribe();
        alert('tạo thành công');
        this.resetForm();
        
    }

    ngOnInit(): void {
        this.productService.getSanpham().subscribe();
        this.productService.sanpham$.subscribe((res) => {
            return (this.products = res);
        });
        this.ladingpageService.getLandingpage().subscribe()
        this.offerService.getoffer().subscribe();
        this.offerService.offer$.subscribe((res) => {
            res?.forEach((v) => {
                return (v.TenSP = this.products.find(
                    (x) => x.id == v.idP
                )?.name);
            });
            return (this.offers = res);
        });
        this.flowService.getFlow().subscribe();
        this.flowService.flow$.subscribe((res) => {
            res?.forEach((v) => {
                let a = this.offers?.find((x) => x.id == v.idOffer);
               if(a && a.idP){
                let b = this.products?.find((x) => x.id == a.idP);
                v.TenSP = b?.name;
               }
               
            });

            this.dataSource = new MatTableDataSource(res);

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            return (this.flow = res);
        });
        this.flowForm = this.fb.group({
         
            idOffer: [0],
            name: [''],
            TenSP: [''],
            link: [''],
            landingpage: [''],
            traffic: [''],
        });
    }
}
