import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarnetOrdreComponent } from './add-carnet-ordre.component';

describe('AddCarnetOrdreComponent', () => {
  let component: AddCarnetOrdreComponent;
  let fixture: ComponentFixture<AddCarnetOrdreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCarnetOrdreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCarnetOrdreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
