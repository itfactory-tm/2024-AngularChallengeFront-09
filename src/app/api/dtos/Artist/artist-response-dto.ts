import { GenreResponseDto } from "../Genre/genre-response-dto";
import { Image } from "./image";

export interface ArtistResponseDto {
    name: string;
    biography: string;
    genres?: GenreResponseDto[];
    spotifyImage?: Image
}
