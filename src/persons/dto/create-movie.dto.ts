export class CreateMovieDto {
  title!: string;
  releaseYear!: number;
  castingIds?: number[];
  directorIds?: number[];
  producerIds?: number[];
}
