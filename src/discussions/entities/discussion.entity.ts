import { User } from 'src/users/entities/user.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'discussions' })
export class Discussion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  members: User[];
}
