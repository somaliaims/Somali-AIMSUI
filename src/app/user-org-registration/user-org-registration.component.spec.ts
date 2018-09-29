import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrgRegistrationComponent } from './user-org-registration.component';

describe('UserOrgRegistrationComponent', () => {
  let component: UserOrgRegistrationComponent;
  let fixture: ComponentFixture<UserOrgRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOrgRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrgRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
