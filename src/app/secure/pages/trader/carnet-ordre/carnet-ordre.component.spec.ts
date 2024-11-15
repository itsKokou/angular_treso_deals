import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnetOrdreComponent } from './carnet-ordre.component';

describe('CarnetOrdreComponent', () => {
  let component: CarnetOrdreComponent;
  let fixture: ComponentFixture<CarnetOrdreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarnetOrdreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarnetOrdreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
