import { APIGatewayProxyHandler } from 'aws-lambda';
import { v1 as uuid } from 'uuid';
import { Session } from '../databases/watsonAssistant/interfaces/session.interface';

/**
 *
 * @param event
 */
export const handler: APIGatewayProxyHandler = async (event) => {

    if(!event.body) {
        console.error('No body');
    }

    const body = JSON.parse(event.body);
    let session = {};

    switch (body.method) {
        case 'welcome':
            session = welcome(body.localTime, body.timeZone);
            break;
        case 'setPersonName':
            // Save name into the document that matches with the uuid
            // return the document
            break;
        default:
    }

    return {
        statusCode: 200,
        body: JSON.stringify(session),
    };
};

/**
 * Save the uuid into a new session document
 */
const welcome = (localTime: string, timeZone: string): Session => {

    const session: Session = {
        uuid: uuid(),
        person: {
            localTime: localTime,
            timeZone: timeZone,
        },
        createAt: new Date(),
    };

    return session;
};