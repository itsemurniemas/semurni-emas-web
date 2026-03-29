import { ApiUseCase } from '../base/ApiUseCase';
import { Pokemon } from '../entities/Pokemon';
import { HttpMethod } from '../api-config';

export class GetPokemonListRequest {
  limit: number = 20;

  constructor(init?: Partial<GetPokemonListRequest>) {
    Object.assign(this, init);
  }
}

export class GetPokemonList extends ApiUseCase<void, Pokemon[]> {
  async execute(): Promise<Pokemon[]> {
    const params = new GetPokemonListRequest({ limit: 20 });
    const response = await this.request<{ results: Pokemon[] }>('/pokemon', HttpMethod.GET, params);
    return response.results;
  }
}
