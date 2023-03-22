import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class User {
  id!: string;

  @Column()
  email!: string;

  @Column()
  password?: string;

  @Column()
  role!: string;

  @Column({ name: "created_at" })
  createdAt?: Date;

  @Column({ name: "updated_at" })
  updatedAt?: Date;
}
