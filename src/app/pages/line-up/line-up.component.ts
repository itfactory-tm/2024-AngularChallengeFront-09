import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistComponent } from '../../components/artist/artist.component';
import { ArtistResponseDto } from '../../api/dtos/Artist/artist-response-dto';
import { ArtistService } from '../../api/services/Artist/artist.service';


@Component({
  selector: 'app-line-up',
  standalone: true,
  imports: [ArtistComponent, AsyncPipe, RouterModule],
  templateUrl: './line-up.component.html',
  styleUrl: './line-up.component.css'
})
export class  LineUpComponent implements OnInit {
  artistList$!: Observable<ArtistResponseDto[]>;
 

  constructor(private artistService : ArtistService) { }

  ngOnInit(): void {
    this.artistList$ = this.artistService.getArtists();
    
  }
}
