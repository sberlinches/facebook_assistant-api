import { APIGatewayProxyResult, APIGatewayEvent, Context } from 'aws-lambda';
import { SessionController } from '../controllers/session.controller';

/**
 * Gets a list of all sessions
 * @param {APIGatewayEvent} event
 * @param {Context} context
 * @return {Promise<APIGatewayProxyResult>}
 */
module.exports.handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

    context.callbackWaitsForEmptyEventLoop = false;
    return SessionController.getAll();
};
