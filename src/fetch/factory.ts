import { Config, KubeConfig } from '../config'
import { Client } from '../client'
import { FetchClient, FetchFn } from './client'
import { UrlGenerator } from '../urlgenerator'
import { KubernetesUrlGenerator } from './urlgenerator'
import { Authorizer } from './authorizer'
import { DefaultAuthorizer } from './default-authorizer'

export class FetchClientBuilder {
  private fetchFn?: FetchFn
  private urlGenerator?: UrlGenerator
  private authorizer?: Authorizer

  private constructor(private config: KubeConfig) {}

  public static NewWithConfig(config: KubeConfig): FetchClientBuilder {
    return new FetchClientBuilder(config)
  }

  public WithFetchFn(fn: FetchFn): FetchClientBuilder {
    this.fetchFn = fn
    return this
  }

  public WithUrlGenerator(generator: UrlGenerator): FetchClientBuilder {
    this.urlGenerator = generator
    return this
  }

  public WithAuthorizer(authorizer: Authorizer): FetchClientBuilder {
    this.authorizer = authorizer
    return this
  }

  public Build(): Client {
    return new FetchClient(
      this.urlGenerator ?? new KubernetesUrlGenerator(),
      this.authorizer ?? new DefaultAuthorizer(this.config),
      this.fetchFn
    )
  }

  public Default(token: string, server = ''): Client {
    return FetchClientBuilder.NewWithConfig(Config.FromToken(token, server)).Build()
  }
}
