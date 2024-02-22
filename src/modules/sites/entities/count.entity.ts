import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Count {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  siteId: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  referer?: string;

  @Column()
  page?: string;

  @Column()
  country?: string;

  @Column()
  ip?: string;

  @Column({ default: '' })
  client?: string = '';
}
