import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { KnowledgeConditionxQuizEntity } from "./knowledge-conditionxquiz.entity";

@Entity({ name: 'knowledge_condition', synchronize: false })
export class KnowledgeConditionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    knowledge_conditionid: string;

    @Column()
    description: string;

    @OneToMany(
        () => KnowledgeConditionxQuizEntity,
        (knowledgeConditionxQuiz) => knowledgeConditionxQuiz.knowledge_condition,
    )
    knowledge_conditionxquiz: KnowledgeConditionxQuizEntity[];
}