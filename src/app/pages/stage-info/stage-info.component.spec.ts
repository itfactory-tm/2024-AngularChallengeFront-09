import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageInfoComponent } from './stage-info.component';

describe('StageInfoComponent', () => {
  let component: StageInfoComponent;
  let fixture: ComponentFixture<StageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
