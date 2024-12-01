import { GenreRequestDto } from "../Genre/genre-request-dto";

export interface ArtistRequestDto {
    name: string;
    genres: GenreRequestDto[];
    discogsId: string;
}
