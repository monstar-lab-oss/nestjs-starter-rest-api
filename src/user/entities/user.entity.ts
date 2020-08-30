import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  @Exclude()
  createdAt;

  @UpdateDateColumn()
  @Exclude()
  updatedAt;
}
