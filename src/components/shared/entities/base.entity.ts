import { Exclude } from 'class-transformer';
import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @Exclude()
  @Column({
    type: 'uuid',
    default: () => `'00000000-0000-0000-0000-000000000000'`,
  })
  tenantid: string;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  creationdate: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  lastmodificationdate: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
  deletiondate: Date;

  @Exclude()
  @Column({ type: 'uuid', nullable: true })
  creationuserid: string;

  @Exclude()
  @Column({ type: 'uuid', nullable: true })
  lastmodificationuserid: string;

  @Exclude()
  @Column({ type: 'uuid', nullable: true })
  deletionuserid: string;
}
