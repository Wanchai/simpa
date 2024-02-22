import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DayCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  siteId: string;

  @Column()
  date: Date;

  @Column()
  test: string;
}
