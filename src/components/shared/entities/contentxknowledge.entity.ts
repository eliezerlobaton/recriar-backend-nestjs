import { KnowledgeEntity } from '../../knowledge/entities/knowledge.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ContentEntity } from 'src/components/content/entities/content.entity';

@Entity({ name: 'contentxknowledge', synchronize: false })
export class ContentXKnowledgeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  contentxknowledgeid: string;

  @ManyToOne(() => KnowledgeEntity, (knowledge) => knowledge.knowledgeid)
  @JoinColumn({ name: 'knowledgeid' })
  knowledge: KnowledgeEntity;

  @ManyToOne(() => ContentEntity, (content) => content.contentid)
  @JoinColumn({ name: 'contentid' })
  content: ContentEntity;
}
