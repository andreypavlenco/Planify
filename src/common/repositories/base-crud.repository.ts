import {
  DeepPartial,
  DeleteResult,
  Repository,
  ObjectLiteral,
  FindOptionsWhere,
} from 'typeorm';

export abstract class BaseCrudRepository<Entity extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<Entity>) {}

  createEntity(dto: DeepPartial<Entity>): Entity {
    return this.repository.create(dto);
  }

  saveEntity(dto: Entity): Promise<Entity> {
    return this.repository.save(dto);
  }

  create(dto: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.createEntity(dto);
    return this.saveEntity(entity);
  }

  findAll(relations: string[] = []): Promise<Entity[]> {
    return this.repository.find({ relations });
  }

  findOne(id: number, relations: string[] = []): Promise<Entity | null> {
    const where: FindOptionsWhere<Entity> = {
      id,
    } as unknown as FindOptionsWhere<Entity>;
    return this.repository.findOne({ where, relations });
  }

  update(dto: Entity): Promise<Entity> {
    return this.saveEntity(dto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}
