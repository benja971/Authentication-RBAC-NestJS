import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @Column({ type: 'uuid', unique: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
