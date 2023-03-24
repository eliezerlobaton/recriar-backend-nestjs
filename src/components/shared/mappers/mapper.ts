export abstract class Mapper<I, O> {
  abstract mapFrom(data: I): O;
  abstract mapTo(data: O): I;
}
