import { APIGatewayProxyResult, APIGatewayEvent, Context } from 'aws-lambda';
import { SessionController } from '../controllers/session.controller';

/**
 * Gets the information collected in a particular session
 * @param {APIGatewayEvent} event
 * @param {Context} context
 */
module.exports.handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

    context.callbackWaitsForEmptyEventLoop = false;
    return SessionController.getOne(event);
};