import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new person and optionally link them to movies
  async create(createPersonDto: CreatePersonDto) {
    const {
      firstName,
      lastName,
      aliases,
      moviesAsActorIds,
      moviesAsDirectorIds,
      moviesAsProducerIds,
    } = createPersonDto;

    return this.prisma.person.create({
      data: {
        firstName,
        lastName,
        aliases,
        moviesAsActor: moviesAsActorIds
          ? { connect: moviesAsActorIds.map((id) => ({ id })) }
          : undefined,
        moviesAsDirector: moviesAsDirectorIds
          ? { connect: moviesAsDirectorIds.map((id) => ({ id })) }
          : undefined,
        moviesAsProducer: moviesAsProducerIds
          ? { connect: moviesAsProducerIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        moviesAsActor: true,
        moviesAsDirector: true,
        moviesAsProducer: true,
      },
    });
  }

  // Retrieve all persons, including the movies they participated in
  async findAll() {
    return this.prisma.person.findMany({
      include: {
        moviesAsActor: true,
        moviesAsDirector: true,
        moviesAsProducer: true,
      },
    });
  }

  // Retrieve a single person by ID, including their movies
  async findOne(id: number) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        moviesAsActor: true,
        moviesAsDirector: true,
        moviesAsProducer: true,
      },
    });
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return person;
  }

  // Update a person and update their movie relations
  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const {
      firstName,
      lastName,
      aliases,
      moviesAsActorIds,
      moviesAsDirectorIds,
      moviesAsProducerIds,
    } = updatePersonDto;

    // Check if person exists
    await this.findOne(id);

    return this.prisma.person.update({
      where: { id },
      data: {
        firstName,
        lastName,
        aliases,
        moviesAsActor: moviesAsActorIds
          ? { set: moviesAsActorIds.map((id) => ({ id })) }
          : undefined,
        moviesAsDirector: moviesAsDirectorIds
          ? { set: moviesAsDirectorIds.map((id) => ({ id })) }
          : undefined,
        moviesAsProducer: moviesAsProducerIds
          ? { set: moviesAsProducerIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        moviesAsActor: true,
        moviesAsDirector: true,
        moviesAsProducer: true,
      },
    });
  }

  // Delete a person
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.person.delete({
      where: { id },
    });
  }
}
