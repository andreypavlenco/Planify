import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity()
export class StatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.status)
  @JoinColumn()
  task: Task;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  user: User;

  @Column()
  action: string;

  @Column({ type: 'timestamp' })
  changeDate: Date;
}
