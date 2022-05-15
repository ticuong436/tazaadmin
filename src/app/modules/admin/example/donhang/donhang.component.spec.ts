import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonhangComponent } from './donhang.component';

describe('DonhangComponent', () => {
  let component: DonhangComponent;
  let fixture: ComponentFixture<DonhangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonhangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonhangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
