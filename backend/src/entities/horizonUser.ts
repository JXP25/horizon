import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity({ name: "horizon_user" })
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "first_name" })
  firstName!: string;

  @Column({ name: "last_name", nullable: true })
  lastName?: string;

  @Column({ name: "profile_image_url", nullable: true })
  profileImageURL?: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  salt!: string;
}
