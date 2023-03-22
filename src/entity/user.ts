import { Entity, Column, PrimaryColumn } from "typeorm";
import { UserRoles } from "../users/usersTypes";

@Entity()
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  email!: string;

  @Column()
  password?: string;

  @Column()
  role!: UserRoles;

  @Column({ name: "created_at" })
  createdAt?: Date;

  @Column({ name: "updated_at" })
  updatedAt?: Date;
}
