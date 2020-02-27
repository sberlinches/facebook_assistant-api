import { MongoClient, MongoClientOptions } from 'mongodb';

/**
 * Mongo connection
 */
export class MongoConnection {

  private readonly _srv: boolean;
  private readonly _host: string;
  private readonly _port: number;
  private readonly _user: string;
  private readonly _password: string;
  private readonly _options: MongoClientOptions;
  private readonly _connectionString: string;
  private _client: MongoClient;

  /**
   * Creates a MongoDB connection
   * @param {boolean} srv
   * @param {string} host
   * @param {number} port
   * @param {string} user
   * @param {string} password
   * @param {MongoClientOptions} options
   */
  constructor(srv: boolean, host: string, port: number, user: string, password: string, options: MongoClientOptions) {
    this._srv = srv;
    this._host = host;
    this._port = port;
    this._user = user;
    this._password = password;
    this._options = options;
    this._connectionString = this.prepareConnectionString();
  }

  /**
   * Prepares the connection string
   * mongodb+srv://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]
   * @return {string}
   */
  private prepareConnectionString(): string {

    const prefix = (this._srv) ? 'mongodb+srv' : 'mongodb';
    const auth = (this._user) ? `${this._user}:${this._password}@` : '';
    const url = (this._srv) ? this._host : `${this._host}:${this._port}`;

    return `${prefix}://${auth}${url}`;
  }

  /**
   * Connects to a MongoDB
   * @return {Promise<MongoClient>}
   */
  public async connect(): Promise<MongoClient> {

    if(this._client) {
      console.log('%o: Using cached Mongo connexion: %s', new Date(), this._connectionString);
      return Promise.resolve(this._client);
    }

    return new Promise((resolve, reject) => {
      MongoClient.connect(this._connectionString, this._options)
        .then((client) => {
          console.log('%o: Mongo connected to: %s', new Date(), this._connectionString);
          this._client = client;
          resolve(client);
        })
        .catch((err) => {
          console.log('%o: Mongo failed to connect to: %s', new Date(), this._connectionString);
          reject(err);
        });
    });
  }

  /**
   * Closes the MongoDB connection
   */
  public close(): void {
    if (this._client) {
      this._client.close()
        .then(() => {
          console.log('%o: Mongo connection closed', new Date());
        });
    }
  }
}
