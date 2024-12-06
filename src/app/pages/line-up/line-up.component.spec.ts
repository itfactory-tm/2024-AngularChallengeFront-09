import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineUpComponent } from './line-up.component';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';

describe('LineUpComponent', () => {
  let fixture: ComponentFixture<LineUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineUpComponent, RouterLink],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideAuth0({
          domain: environment.auth0Domain,
          clientId: environment.auth0ClientId,
          authorizationParams: {
            redirect_uri: window.location.origin,
            audience: environment.auth0Audience,
          },
        }),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineUpComponent);
  });

  it('filters artists by search query correctly', () => {
    fixture.componentInstance.artistSchedule = [
        { id: "", biography: "", name: "Adele", discogsId: "", genres: [], showFullBio: false },
        { id: "", biography: "", name: "Ed Sheeran", discogsId: "", genres: [], showFullBio: false },
        { id: "", biography: "", name: "Beyoncé", discogsId: "", genres: [], showFullBio: false },
        { id: "", biography: "", name: "Lady Gaga", discogsId: "", genres: [], showFullBio: false },
        { id: "", biography: "", name: "Eminem", discogsId: "", genres: [], showFullBio: false }
    ];

    fixture.componentInstance.searchQuery = "ad";

    fixture.componentInstance.filterArtists();

    fixture.detectChanges();

    const cardsTags = fixture.debugElement.queryAll(By.css('app-artist'));
    expect(cardsTags.length).toBe(2);
  });
});
