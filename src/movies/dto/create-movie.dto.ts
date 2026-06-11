export class CreateMovieDto {
  title!: string;
  releaseYear!: number;
  //Optional
  castingIds?: number[];
  directorIds?: number[];
  producerIds?: number[];
}
