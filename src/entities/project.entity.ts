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
import { ProjectStatus } from 'src/shared/enums';
import { Role } from './role.entity';
import { ActionHistory } from './action-history.entity';

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

  @OneToMany(() => Role, (role) => role.project, {
    cascade: true,
  })
  roles: Role[];

  @OneToMany(() => ActionHistory, (actionHistory) => actionHistory.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  actionHistory: ActionHistory[];

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable()
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
