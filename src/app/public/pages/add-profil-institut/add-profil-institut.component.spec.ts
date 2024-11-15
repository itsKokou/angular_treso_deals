import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfilInstitutComponent } from './add-profil-institut.component';

describe('AddProfilInstitutComponent', () => {
  let component: AddProfilInstitutComponent;
  let fixture: ComponentFixture<AddProfilInstitutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProfilInstitutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProfilInstitutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
