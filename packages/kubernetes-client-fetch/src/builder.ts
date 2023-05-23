import { Config, KubeConfig, KubernetesUrlGenerator, UrlGenerator } from '@ccremer/kubernetes-client/api'
import { FetchClient, FetchFn } from './fetch-client'
import { Authorizer, DefaultAuthorizer, NoopAuthorizer } from './authorizer'
import { Client } from './client'

/**
 * KubeClientBuilder constructs a {@link Client} instance using the Fetch API as implementation.
 */
export class KubeClientBuilder {
  private fetchFn?: FetchFn
  private thisArg?: ThisParameterType<unknown>

  private urlGenerator?: UrlGenerator
  private authorizer?: Authorizer

  /**
   * Creates a new builder instance to configure the client.
   * Uses sane defaults if not customized.
   * @param config the well-known Kubernetes configuration in the shape of a {@link KubeConfig} file.
   * @returns new KubeClientBuilder instance
   */
  constructor(private config?: KubeConfig) {}

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
    let authorizer = this.authorizer
    if (!authorizer) {
      authorizer = this.config ? new DefaultAuthorizer(this.config) : new NoopAuthorizer()
    }
    return new FetchClient(
      this.urlGenerator ?? new KubernetesUrlGenerator(),
      authorizer,
      this.fetchFn ?? fetch,
      this.thisArg ?? window
    )
  }

  /**
   * Constructs a default implementation of a {@link Client} that uses a static access token.
   * @param token the access token
   * @param server the root endpoint path for the Kubernetes API server.
   */
  public static DefaultClient(token: string, server = ''): Client {
    return new KubeClientBuilder(Config.FromToken(token, server)).Build()
  }
}
