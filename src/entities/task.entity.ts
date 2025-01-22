import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';
import { TaskStatus } from 'src/enums';

@Entity()
@Index(['status'])
@Index(['deadline'])
@Index(['project', 'assignee', 'status'])
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn()
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks, {
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

  @Column({ nullable: true })
  description: string;
}
