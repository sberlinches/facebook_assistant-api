import { MongoClient } from 'mongodb';
import { MongoConnection } from '../../lib/mongoConnection';
import { SessionCollection } from './collections/session.collection';

/**
 * Watson Assistant database
 */
export class WatsonAssistantDb {

    private static readonly _mongoConnection = new MongoConnection(
        process.env.MONGO_WA_HOST,
        process.env.MONGO_WA_USER,
        process.env.MONGO_WA_PASSWORD,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin',
            replicaSet: 'Cluster0-shard-0',
            readPreference: 'primary',
            appname: 'MongoDB%20Compass',
            ssl: true,
        }, // TODO: env
    );

    // Collections
    public static session;

    /**
     * Connects to the database
     * @return {Promise<any>}
     */
    public static connect(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._mongoConnection.connect()
                .then((mongoClient) => {
                    this.initialize(mongoClient);
                    resolve(this);
                })
                .catch(reject);
        });
    }

    /**
     * Closes the database connection
     */
    public static close(): void {
        this._mongoConnection.close();
    }

    /**
     * Initializes the collections (collections)
     * @param {MongoClient} mongoClient
     */
    private static initialize(mongoClient: MongoClient): void {
        this.session = new SessionCollection(mongoClient);
    }
}
