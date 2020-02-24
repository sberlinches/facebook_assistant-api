import { ObjectID } from 'mongodb';
import { Person } from './person.interface'

export interface Session {
    _id?: ObjectID;
    person: Person;
    createdAt: Date;
}
