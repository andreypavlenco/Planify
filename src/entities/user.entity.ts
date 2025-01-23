import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Task } from './task.entity';
import { Role } from './role.entity';
import { Project } from './project.entity';

@Entity()
@Index(['lastName'])
@Index(['firstName', 'lastName'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  role: Role;

  @OneToMany(() => Task, (task) => task.assignee, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  tasks: Task[];

  @ManyToMany(() => Project, (project) => project.users)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
