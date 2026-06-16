import { Expose, Type } from 'class-transformer';
import { PersonEntity } from '../../persons/entities/person.entity';

export class MovieEntity {
  id!: number;
  title!: string;
  releaseYear!: number;

  @Type(() => PersonEntity)
  casting?: PersonEntity[];

  @Type(() => PersonEntity)
  directors?: PersonEntity[];

  @Type(() => PersonEntity)
  producers?: PersonEntity[];

  @Expose()
  // Convertimos el año a número romano al vuelo en la serialización
  get releaseYearRoman(): string {
    let num = this.releaseYear;
    const roman: { [key: string]: number } = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let result = '';
    for (const key of Object.keys(roman)) {
      const repeatCount = Math.floor(num / roman[key]);
      num -= repeatCount * roman[key];
      result += key.repeat(repeatCount);
    }
    return result;
  }

  constructor(partial: Partial<MovieEntity>) {
    Object.assign(this, partial);
  }
}
