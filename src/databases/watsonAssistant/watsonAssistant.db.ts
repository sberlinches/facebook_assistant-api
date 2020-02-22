import { MongoClient } from 'mongodb';
import { MongoConnection } from '../../lib/mongoConnection';
import { SessionCollection } from './collections/session.collection';

/**
 * Watson Assistant database
 */
export class WatsonAssistantDb {

    private static readonly _default = new MongoConnection(
        'cluster0-dmiiq.mongodb.net', // TODO: env
        'sberlinches', // TODO: env
        'rcwdHkpGAj1B8EGI', // TODO: env
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
     * @return {Promise<void>}
     */
    public static connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._default.connect()
                .then((mongoClient) => {
                    this.initialize(mongoClient);
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Closes the database connection
     */
    public static close(): void {
        this._default.close();
    }

    /**
     * Initializes the collections (collections)
     * @param {MongoClient} mongoClient
     */
    private static initialize(mongoClient: MongoClient): void {
        this.session = new SessionCollection(mongoClient);
    }
}
