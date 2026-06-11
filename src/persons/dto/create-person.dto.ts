export class CreatePersonDto {
  firstName!: string;
  lastName!: string;
  aliases?: string; // optional field for aliases

  //Optional array of Movies IDs to linke them in their respective roles
  moviesAsActorIds?: number[];
  moviesAsDirectorIds?: number[];
  moviesAsProducerIds?: number[];
}
