import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { title, releaseYear, castingIds, directorIds, producerIds } =
      createMovieDto;

    return this.prisma.movie.create({
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
      include: { casting: true, directors: true, producers: true },
    });
  }

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      include: { casting: true, directors: true, producers: true },
    });
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: { casting: true, directors: true, producers: true },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const { title, releaseYear, castingIds, directorIds, producerIds } =
      updateMovieDto;

    await this.findOne(id); // Check if exists

    return this.prisma.movie.update({
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
      include: { casting: true, directors: true, producers: true },
    });
  }

  async remove(id: number): Promise<Movie> {
    await this.findOne(id);
    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
