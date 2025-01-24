import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutLayoutComponent } from './institut-layout.component';

describe('InstitutLayoutComponent', () => {
  let component: InstitutLayoutComponent;
  let fixture: ComponentFixture<InstitutLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
