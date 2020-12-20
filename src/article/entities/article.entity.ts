import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  post: string;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;
}
