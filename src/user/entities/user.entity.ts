import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  password: string;

  @Unique('username', ['username'])
  @Column({ length: 200 })
  username: string;

  @Column('simple-array')
  roles: string[];

  @Column()
  isAccountDisabled: boolean;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Timestamp;
}
