import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper method to convert years to Roman Numerals on the fly
  private convertToRoman(num: number): string {
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
    let temp = num;
    for (const key of Object.keys(roman)) {
      const repeatCount = Math.floor(temp / roman[key]);
      temp -= repeatCount * roman[key];
      result += key.repeat(repeatCount);
    }
    return result;
  }

  // Helper method to append the Roman Numeral representation
  private enrichMovieWithRoman(movie: any) {
    if (!movie) return null;
    return {
      ...movie,
      releaseYearRoman: this.convertToRoman(movie.releaseYear),
    };
  }

  // Create a new movie and optionally link people to their roles
  async create(createMovieDto: CreateMovieDto) {
    const { title, releaseYear, castingIds, directorIds, producerIds } =
      createMovieDto;

    const movie = await this.prisma.movie.create({
      data: {
        title,
        releaseYear,
        casting: castingIds
          ? { connect: castingIds.map((id) => ({ id })) }
          : undefined,
        directors: directorIds
          ? { connect: directorIds.map((id) => ({ id })) }
          : undefined,
        producers: producerIds
          ? { connect: producerIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        casting: true,
        directors: true,
        producers: true,
      },
    });

    return this.enrichMovieWithRoman(movie);
  }

  // Retrieve all movies with full person documents in their roles
  async findAll() {
    const movies = await this.prisma.movie.findMany({
      include: {
        casting: true,
        directors: true,
        producers: true,
      },
    });
    return movies.map((movie) => this.enrichMovieWithRoman(movie));
  }

  // Retrieve a single movie by ID with full person documents
  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        casting: true,
        directors: true,
        producers: true,
      },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return this.enrichMovieWithRoman(movie);
  }

  // Update a movie and update the associated people relations
  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const { title, releaseYear, castingIds, directorIds, producerIds } =
      updateMovieDto;

    // First check if the movie exists
    await this.findOne(id);

    const movie = await this.prisma.movie.update({
      where: { id },
      data: {
        title,
        releaseYear,
        casting: castingIds
          ? { set: castingIds.map((id) => ({ id })) }
          : undefined,
        directors: directorIds
          ? { set: directorIds.map((id) => ({ id })) }
          : undefined,
        producers: producerIds
          ? { set: producerIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        casting: true,
        directors: true,
        producers: true,
      },
    });

    return this.enrichMovieWithRoman(movie);
  }

  // Delete a movie
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
