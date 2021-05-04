import { IsEmail, IsEnum, IsNotEmpty, Length } from "class-validator";
import {
  Entity,
  Column,
  OneToMany,
  Unique,
} from "typeorm";
import { Model } from "./Model";
import { Post } from "./Post";

@Entity("users")
export class User extends Model {
  @Column({ unique: true })
  @Length(3, 255)
  @IsNotEmpty()
  name: string;

  @Column()
  @Length(3, 255)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ type: 'enum', enum: ['user', 'admin', 'superadmin'], default: 'user'})
  @IsEnum(['user', 'admin', 'superadmin', undefined])
  role: string;

  @OneToMany(() => Post, post => post.user) 
  posts: Post[];
}
