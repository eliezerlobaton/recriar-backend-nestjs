import { BaseEntity } from '../../shared/entities/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import { ContentXKnowledgeEntity } from '../../shared/entities/contentxknowledge.entity';

@Entity({ name: 'content', synchronize: false })
export class ContentEntity extends BaseEntity {
  @Expose({ name: 'id' })
  @PrimaryGeneratedColumn('uuid')
  contentid: string;

  @Column({ type: 'character varying', length: 300 })
  title: string;

  @Column({ type: 'character varying', length: 100 })
  image: string;

  @Column({ type: 'text' })
  body: string;

  @Expose({ name: 'readingTime' })
  @Column({ type: 'integer' })
  readingtime: number;

  @Expose({ name: 'contentComplexity' })
  @Column({ type: 'character varying', length: 30 })
  contentcomplexity: string;

  @Expose({ name: 'contentType' })
  @Column({ type: 'character varying', length: 30 })
  contenttype: string;

  @Expose({ name: 'knowledges' })
  @Transform((value) => {
    value = null;
    return value;
  })
  @OneToMany(
    () => ContentXKnowledgeEntity,
    (contentxKnowledge) => contentxKnowledge.content,
  )
  contentxknowledges: ContentXKnowledgeEntity[];
}
