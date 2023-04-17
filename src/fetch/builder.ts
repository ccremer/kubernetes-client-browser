import { Config, KubeConfig } from '../config'
import { Client } from '../client'
import { FetchClient, FetchFn } from './client'
import { UrlGenerator } from '../urlgenerator'
import { KubernetesUrlGenerator } from './urlgenerator'
import { Authorizer } from './authorizer'
import { DefaultAuthorizer } from './default-authorizer'

/**
 * KubeClientBuilder constructs a {@link Client} instance using the Fetch API as implementation.
 */
export class KubeClientBuilder {
  private fetchFn?: FetchFn
  private thisArg?: ThisParameterType<unknown>

  private urlGenerator?: UrlGenerator
  private authorizer?: Authorizer

  private constructor(private config: KubeConfig) {}

  /**
   * Creates a new builder instance to configure the client.
   * Uses sane defaults if not customized.
   * @param config the well-known Kubernetes configuration in the shape of a {@link KubeConfig} file.
   * @returns new KubeClientBuilder instance
   */
  public static NewWithConfig(config: KubeConfig): KubeClientBuilder {
    return new KubeClientBuilder(config)
  }

  /**
   * Sets the Fetch function for the client.
   * If not set, the default Fetch API from `window` is used.
   * @param fn a Fetch API compatible function to execute requests.
   * @param bindTo the object to bind the function to. If undefined, the function is bound to `window`.
   * @returns current builder instance `this`
   */
  public WithFetchFn(fn: FetchFn, bindTo?: ThisParameterType<unknown>): KubeClientBuilder {
    this.fetchFn = fn
    this.thisArg = bindTo
    return this
  }

  /**
   * Sets the {@link UrlGenerator} of the client.
   * This is used to determine the API endpoint URLs of each resource.
   * @param generator the generator.
   * @returns current builder instance `this`
   */
  public WithUrlGenerator(generator: UrlGenerator): KubeClientBuilder {
    this.urlGenerator = generator
    return this
  }

  /**
   * Sets the {@link Authorizer} of the client.
   * The authorizer performs the authentication and authorization of a request.
   * If not set, the default authorizer is using a JWT in the request header.
   * @param authorizer the authorizer
   * @returns current builder instance `this`
   */
  public WithAuthorizer(authorizer: Authorizer): KubeClientBuilder {
    this.authorizer = authorizer
    return this
  }

  /**
   * Builds the client with the configured settings.
   * @returns current builder instance `this`
   */
  public Build(): Client {
    return new FetchClient(
      this.urlGenerator ?? new KubernetesUrlGenerator(),
      this.authorizer ?? new DefaultAuthorizer(this.config),
      this.fetchFn ?? fetch,
      this.thisArg ?? window
    )
  }

  public static DefaultClient(token: string, server = ''): Client {
    return KubeClientBuilder.NewWithConfig(Config.FromToken(token, server)).Build()
  }
}
