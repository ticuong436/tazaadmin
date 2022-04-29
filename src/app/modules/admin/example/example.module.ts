import { NgModule, LOCALE_ID } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { MaterialExampleModule } from 'material.module';
import { DanhmucComponent } from './danhmuc/danhmuc.component';
import { OfferComponent } from './offer/offer.component';
import { SanphamComponent } from './sanpham/sanpham.component';
import {  FlowComponent} from './flow/flow.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { LandingpageComponent } from './landingpage/landingpage.component';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

const exampleRoutes: Route[] = [
    {
        path: '',
        component: ExampleComponent,
        children: [
            { path: 'offer', component: OfferComponent },
            { path: 'danh-muc', component: DanhmucComponent },
            { path: 'san-pham', component: SanphamComponent },
            {path:'flow', component:FlowComponent}
        ],
    },
];

@NgModule({
    declarations: [
        ExampleComponent,
        DanhmucComponent,
        OfferComponent,
        SanphamComponent,
        FlowComponent,
        LandingpageComponent,
    ],
    providers: [
        {
            provide: LOCALE_ID,
            useValue: 'de-DE',
        },
        CurrencyPipe,
    ],

    imports: [
        RouterModule.forChild(exampleRoutes),
        MaterialExampleModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
})
export class ExampleModule {}
