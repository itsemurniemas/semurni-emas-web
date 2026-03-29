export abstract class UseCase<IRequest, IResponse> {
  abstract execute(request: IRequest): Promise<IResponse>;
}
