import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineUpComponent } from './line-up.component';

describe('LineUpComponent', () => {
  let component: LineUpComponent;
  let fixture: ComponentFixture<LineUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
