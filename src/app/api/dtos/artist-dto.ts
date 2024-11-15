import { SpotifyResponseDto } from "./spotify-response-dto";

export interface ArtistDto {
    name: string;
    biography: string;
    spotifyResponse?: SpotifyResponseDto;
}
