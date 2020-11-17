import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
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

  @Unique('username', ['username'])
  @Column({ length: 200 })
  username: string;
}
