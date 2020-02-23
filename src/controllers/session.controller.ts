import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { ObjectId } from 'mongodb';
import { WatsonAssistantDb } from '../databases/watsonAssistant/watsonAssistant.db';

/**
 * Session controller
 */
export class SessionController {

    /**
     * Gets all sessions.
     * @return {Promise<APIGatewayProxyResult>}
     */
    public static getAll = async (): Promise<APIGatewayProxyResult> => {

        try {
            const db = await WatsonAssistantDb.connect();
            const sessions = await db.session.findAll();

            return {
                statusCode: 200,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify(sessions),
            }
        } catch (e) {
            console.error('%o: %s', new Date(), e);
            return {
                statusCode: 500,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify(e),
            }
        }
    };

    /**
     * Gets a session.
     * @param {APIGatewayEvent} event
     * @return {Promise<APIGatewayProxyResult>}
     */
    public static getOne = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

        try {
            const id = new ObjectId(event.pathParameters.id);
            const db = await WatsonAssistantDb.connect();
            const session = await db.session.findOneById(id);

            return {
                statusCode: 200,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify(session),
            }
        } catch (e) {
            console.error('%o: %s', new Date(), e);
            return {
                statusCode: 500,
                headers: {'Access-Control-Allow-Origin': '*'},
                body: JSON.stringify(e),
            }
        }
    };
}
