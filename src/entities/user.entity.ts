import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Project } from './project.entity';
import { Role } from './role.entity';
import { ActionHistory } from './action-history.entity';

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

  @OneToMany(() => Task, (task) => task.owner, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ownedTasks: Task[];

  @OneToMany(() => Task, (task) => task.assignee, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  assignedTasks: Task[];

  @OneToMany(() => Role, (role) => role.user, {
    cascade: true,
  })
  roles: Role[];

  @ManyToMany(() => Project, (project) => project.users)
  projects: Project[];

  @OneToMany(() => ActionHistory, (actionHistory) => actionHistory.user, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  actionHistory: ActionHistory[];

  @Column({ nullable: true, type: 'text' })
  refreshToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
