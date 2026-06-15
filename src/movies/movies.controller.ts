import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from '../auth/auth.guard';
import { MovieEntity } from './entities/movie.entity';

@Controller('movies')
// This interceptor tells NestJS to run our Entity classes through class-transformer!
@UseInterceptors(ClassSerializerInterceptor)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    const movie = await this.moviesService.create(createMovieDto);
    return new MovieEntity(movie);
  }

  @Get()
  async findAll(): Promise<MovieEntity[]> {
    const movies = await this.moviesService.findAll();
    return movies.map((movie) => new MovieEntity(movie));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MovieEntity> {
    const movie = await this.moviesService.findOne(+id);
    return new MovieEntity(movie);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieEntity> {
    const movie = await this.moviesService.update(+id, updateMovieDto);
    return new MovieEntity(movie);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string): Promise<MovieEntity> {
    const movie = await this.moviesService.remove(+id);
    return new MovieEntity(movie);
  }
}
