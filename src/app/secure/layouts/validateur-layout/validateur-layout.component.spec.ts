import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateurLayoutComponent } from './validateur-layout.component';

describe('ValidateurLayoutComponent', () => {
  let component: ValidateurLayoutComponent;
  let fixture: ComponentFixture<ValidateurLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateurLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidateurLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
