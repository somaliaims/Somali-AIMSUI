import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembershipComponent } from './project-membership.component';

describe('ProjectMembershipComponent', () => {
  let component: ProjectMembershipComponent;
  let fixture: ComponentFixture<ProjectMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
