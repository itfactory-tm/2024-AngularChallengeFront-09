import { GenreDto } from "../genre-dto";
import { Image } from "./image";

export interface ArtisResponsetDto {
    name: string;
    biography: string;
    genres?: GenreDto[];
    spotifyImage?: Image
}
