import { Person, Movie } from '@prisma/client';

export class PersonEntity implements Person {
  id!: number;
  firstName!: string;
  lastName!: string;
  aliases!: string | null;

  moviesAsActor?: Movie[];
  moviesAsDirector?: Movie[];
  moviesAsProducer?: Movie[];

  constructor(partial: Partial<PersonEntity>) {
    Object.assign(this, partial);
  }
}
