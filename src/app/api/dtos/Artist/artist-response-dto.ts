import { GenreDto } from "../genre-dto";
import { Image } from "./image";

export interface ArtistResponseDto {
    name: string;
    biography: string;
    genres?: GenreDto[];
    spotifyImage?: Image
}
