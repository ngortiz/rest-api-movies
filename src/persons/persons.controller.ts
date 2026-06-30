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
  Query,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PersonEntity } from './entities/person.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('persons')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createPersonDto: CreatePersonDto,
  ): Promise<PersonEntity> {
    const person = await this.personsService.create(createPersonDto);
    return new PersonEntity(person);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<{
    data: PersonEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { data, total } = await this.personsService.findAll(paginationDto);
    return {
      data: data.map((person) => new PersonEntity(person)),
      total,
      page: paginationDto.page || 1,
      limit: paginationDto.limit || 10,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PersonEntity> {
    const person = await this.personsService.findOne(+id);
    return new PersonEntity(person);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ): Promise<PersonEntity> {
    const person = await this.personsService.update(+id, updatePersonDto);
    return new PersonEntity(person);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string): Promise<PersonEntity> {
    const person = await this.personsService.remove(+id);
    return new PersonEntity(person);
  }
}
