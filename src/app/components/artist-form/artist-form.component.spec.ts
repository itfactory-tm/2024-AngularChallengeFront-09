import { of } from "rxjs";
import { ArtistFormComponent } from "./artist-form.component"
import { ElementRef, QueryList } from "@angular/core";

describe('ArtistForm', () => {
    let component: ArtistFormComponent;
    let mockArtistService;
    let mockGenreService;

    beforeEach(() => {
        mockArtistService = jasmine.createSpyObj(['updateArtist', 'fetchArtists']);
        mockGenreService = jasmine.createSpyObj(['']);

        component = new ArtistFormComponent(mockArtistService, mockGenreService);
        component.checkboxes = new QueryList<ElementRef>();
        component.selectedArtistDto = {
            name: 'Adele',
            genres: [],
            discogsId: '64c34668-7c54-4750-4b9b-08dd13a4ed8c'
        };
    });

    it('selected genres should be added to the genres of the selected artist', () => {
        component.selectedGenres = ['jazz', 'rock'];

        mockArtistService.updateArtist.and.returnValue(of(true));
        spyOn(component, 'cancelEdit');

        component.submitEdit();

        expect(component.selectedArtistDto.genres).toEqual([{ name: 'jazz' }, { name: 'rock' }]);
    });

    it('all checkboxes should be unchecked after reset', () => {
        component.checkboxes.reset([
            { nativeElement: { checked: true } } as ElementRef,
            { nativeElement: { checked: true } } as ElementRef,
            { nativeElement: { checked: false } } as ElementRef,
        ]);

        component.resetAllCheckboxes();

        const checkedCheckboxes = component.checkboxes
            .filter((checkbox) => checkbox.nativeElement.checked);

        expect(checkedCheckboxes.length).toBe(0);
    });

    it('should add a genre to selectedGenres when checkbox is checked', () => {
        const checkbox1 = {
          target: {
            value: 'pop',
            checked: true,
          }
        };

        const checkbox2 = {
          target: {
            value: 'rock',
            checked: false,
          }
        };

        const checkbox3 = {
          target: {
            value: 'rap',
            checked: true,
          }
        };
    
        component.onCheckboxChange(checkbox1);
        component.onCheckboxChange(checkbox2);
        component.onCheckboxChange(checkbox3);
        expect(component.selectedGenres).toEqual(['pop', 'rap']);
      });
});
