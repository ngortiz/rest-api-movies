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
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PersonEntity } from './entities/person.entity';

@Controller('persons')
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
  async findAll(): Promise<PersonEntity[]> {
    const persons = await this.personsService.findAll();
    return persons.map((person) => new PersonEntity(person));
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
