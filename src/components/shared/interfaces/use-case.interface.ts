export interface UseCase<O> {
  execute(...args: any[]): Promise<O> | O;
}
