import { GenreResponseDto } from "../Genre/genre-response-dto";
import { Image } from "./image";

export interface ArtistResponseDto {
    id: string;
    name: string;
    biography: string;
    genres: GenreResponseDto[];
    discogsImage?: Image;
    discogsId: string;
}
