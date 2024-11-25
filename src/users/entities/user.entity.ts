import { Role } from 'src/roles/roles.enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username?: string;

  @Column({ enum: Role, type: 'enum', array: true, default: [Role.User] })
  roles: Role[];

  @Column({ type: 'varchar', length: 64, nullable: true })
  emailConfirmationToken: string;

  @Column({ type: 'timestamp', nullable: true })
  emailConfirmedAt: Date | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  resetPasswordToken: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
