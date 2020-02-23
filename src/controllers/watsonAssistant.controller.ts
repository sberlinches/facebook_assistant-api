import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { ObjectId } from 'mongodb';
import { Session } from '../databases/watsonAssistant/interfaces/session.interface';
import { WatsonAssistantDb } from '../databases/watsonAssistant/watsonAssistant.db';

/**
 * Watson Assistant controller
 */
export class WatsonAssistantController {

    /**
     * Receives and handles the Watson Assistant collected information.
     * @param {APIGatewayEvent} event
     * @return {Promise<APIGatewayProxyResult>}
     */
    public static handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

        if(!event.body) {
            const message = 'Body required';
            console.error('%o: %s', new Date(), message);
            return {
                statusCode: 500,
                body: JSON.stringify(message),
            }
        }

        try {
            const body = JSON.parse(event.body);
            await WatsonAssistantDb.connect();
            let session: Session;

            switch (body.method) {
                case 'initializeSession':
                    session = await WatsonAssistantController.initializeSession(body.localTime, body.timeZone);
                    break;
                case 'setPersonName':
                    session = await WatsonAssistantController.setPersonName(body.id, body.name);
                    break;
                case 'setPersonHobbies':
                    session = await WatsonAssistantController.setPersonHobbies(body.id, body.hobbies);
                    break;
            }

            return {
                statusCode: 200,
                body: JSON.stringify(session),
            };
        } catch (e) {
            console.error('%o: %s', new Date(), e);
            return {
                statusCode: 500,
                body: JSON.stringify(e),
            }
        }
    };

    /**
     * Initializes the session document where all the extracted info in the
     * current session will be stored.
     * @param {string} localTime — The local time where the person is located
     * @param {string} timeZone — The timezone where the person is located
     * @return {Promise<Session>}
     */
    private static initializeSession = async (localTime: string, timeZone: string): Promise<Session> => {

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
     * Adds the person name to the session document.
     * @param {string} id — The session ID
     * @param {string} name — The name of the person
     * @return {Promise<Session>}
     */
    private static setPersonName = async (id: string, name: string): Promise<Session> => {

        const updatedSession = await WatsonAssistantDb.session
            .setPersonNameById(new ObjectId(id), name);

        return updatedSession.value;
    };

    /**
     * Adds the person hobbies to the session document.
     * @param {string} id — The session ID
     * @param {string} hobbies — The hobbies of the person
     * @return {Promise<Session>}
     */
    private static setPersonHobbies = async (id: string, hobbies: string): Promise<Session> => {

        const updatedSession = await WatsonAssistantDb.session
            .setPersonHobbiesById(new ObjectId(id), hobbies);

        return updatedSession.value;
    };
}
