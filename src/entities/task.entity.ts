import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';
import { TaskStatus } from 'src/shared/enums';
import { ActionHistory } from './action-history.entity';

@Entity()
@Index(['status'])
@Index(['deadline'])
@Index(['project', 'owner', 'assignee', 'status'])
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn()
  project: Project;

  @ManyToOne(() => User, (user) => user.ownedTasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  owner: User;

  @ManyToOne(() => User, (user) => user.assignedTasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  assignee: User;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TO_DO,
  })
  status: TaskStatus;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => ActionHistory, (actionHistory) => actionHistory.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  actionHistory: ActionHistory[];
}
