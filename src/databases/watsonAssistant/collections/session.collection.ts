import {
    Collection,
    FindAndModifyWriteOpResultObject,
    InsertOneWriteOpResult,
    MongoClient,
    ObjectID,
} from 'mongodb';
import { MongoCollection } from '../../../lib/mongoCollection';
import { Session } from '../interfaces/session.interface';

/**
 * Session model
 */
export class SessionCollection extends MongoCollection {

    _collection: Collection<Session>;
    dbName: string;
    collectionName: string;

    constructor(mongoClient: MongoClient) {
        super(mongoClient);

        this.dbName = 'watsonAssistant'; // TODO: env
        this.collectionName = 'session'; // TODO: env
        this._collection = this.createCollection();
    }

    /**
     * Creates the collection
     */
    private createCollection(): Collection<Session> {
        return this._mongoClient
            .db(this.dbName)
            .collection(this.collectionName);
    }

    /**
     * @return {Collection<Session>}
     */
    public get collection(): Collection<Session> {
        return this._collection;
    }

    /**
     * @return {Promise<Array<Session>>} — A list of sessions
     */
    public async findAll(): Promise<Array<Session>> {
        return this._collection
            .find({})
            .toArray();
    }

    /**
     * @param {ObjectID} id
     * @return {Promise<Session>} — A session
     */
    public async findOneById(id: ObjectID): Promise<Session> {
        return this._collection
            .findOne({_id: id});
    }

    /**
     * @param {Session} session — A valid session object
     */
    public async insertOne(session: Session): Promise<InsertOneWriteOpResult<any>> {
        return this._collection
            .insertOne(session);
    }

    /**
     * @param {ObjectID} id
     * @param {string} name
     * @return {Promise<Session>} — The modified session
     */
    public async setPersonNameById(id: ObjectID, name: string): Promise<FindAndModifyWriteOpResultObject<Session>> {
        return this._collection
            .findOneAndUpdate(
                { _id: id },
                { $set: { 'person.name': name }},
                { returnOriginal: false },
            );
    }
}
