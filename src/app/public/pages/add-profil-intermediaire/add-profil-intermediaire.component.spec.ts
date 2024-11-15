import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfilIntermediaireComponent } from './add-profil-intermediaire.component';

describe('AddProfilIntermediaireComponent', () => {
  let component: AddProfilIntermediaireComponent;
  let fixture: ComponentFixture<AddProfilIntermediaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProfilIntermediaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProfilIntermediaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
