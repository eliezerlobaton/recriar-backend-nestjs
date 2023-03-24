import { PartialType } from '@nestjs/swagger';
import { CreateTeamsquadDto } from './create-teamsquad.dto';

export class UpdateTeamsquadDto extends PartialType(CreateTeamsquadDto) {}
