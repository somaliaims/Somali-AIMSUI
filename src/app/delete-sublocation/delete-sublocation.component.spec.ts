import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSublocationComponent } from './delete-sublocation.component';

describe('DeleteSublocationComponent', () => {
  let component: DeleteSublocationComponent;
  let fixture: ComponentFixture<DeleteSublocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSublocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSublocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
