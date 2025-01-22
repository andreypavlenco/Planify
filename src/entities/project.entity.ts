import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity()
@Index(['status'])
@Index(['name'], { unique: true })
@Index(['name', 'status'])
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @OneToMany(() => Task, (task) => task.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tasks: Task[];

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable()
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
