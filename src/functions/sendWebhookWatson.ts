import { APIGatewayProxyHandler } from 'aws-lambda';
import { ObjectId } from 'mongodb';
import { WatsonAssistantDb } from '../databases/watsonAssistant/watsonAssistant.db';
import { Session } from '../databases/watsonAssistant/interfaces/session.interface';

/**
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports.handler = (event, context, callback): APIGatewayProxyHandler => {

    if(!event.body) {
        const message = 'Body required';
        console.error('%o: %s', new Date(), message);
        return callback(message);
    }

    context.callbackWaitsForEmptyEventLoop = false;

    WatsonAssistantDb.connect()
        .then(() => {
            const body = JSON.parse(event.body);

            switch (body.method) {
                case 'welcome':
                    return welcomeDialog(body.localTime, body.timeZone);
                case 'setPersonName':
                    return setPersonName(body.id, body.name);
                default:
                    return {};
            }
        })
        .then((session) => {
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify(session),
            });
        })
        .catch((err) => {
            console.error('%o: %s', new Date(), err);
            return callback(err);
        });
};

/**
 * Welcome Dialog
 * Creates for the very first time the session document where all the extracted
 * info in the current session will be stored.
 * @param {string} localTime
 * @param {string} timeZone
 * @return {Promise<Session>}
 */
const welcomeDialog = async (localTime: string, timeZone: string): Promise<Session> => {

    const session: Session = {
        person: {
            localTime: localTime,
            timeZone: timeZone,
        },
        createAt: new Date(),
    };

    await WatsonAssistantDb.session.insertOne(session);

    return session;
};

/**
 *
 * @param {string} id
 * @param {string} name
 * @return {Promise<Session>}
 */
const setPersonName = async (id: string, name: string): Promise<Session> => {

    const updatedSession = await WatsonAssistantDb.session
        .setPersonNameById(new ObjectId(id), name);

    return updatedSession.value;
};