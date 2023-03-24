export abstract class GetBaseResponseDTO<EntityType> {
  hasNext: boolean;
  items: EntityType;
  _messages: unknown[] | string | undefined;
}
