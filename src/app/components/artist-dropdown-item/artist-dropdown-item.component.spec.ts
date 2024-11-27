import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDropdownItemComponent } from './artist-dropdown-item.component';

describe('ArtistDropdownItemComponent', () => {
  let component: ArtistDropdownItemComponent;
  let fixture: ComponentFixture<ArtistDropdownItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDropdownItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistDropdownItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
