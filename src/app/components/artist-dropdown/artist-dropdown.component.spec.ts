import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDropdownComponent } from './artist-dropdown.component';

describe('ArtistDropdownComponent', () => {
  let component: ArtistDropdownComponent;
  let fixture: ComponentFixture<ArtistDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
