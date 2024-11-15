export interface SpotifyResponseDto {
    genres: string[];
    image: SpotifyImage;
}
  
export interface SpotifyImage {
    url: string;
    width: number;
    height: number;
}
