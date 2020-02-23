import { APIGatewayProxyResult, APIGatewayEvent, Context } from 'aws-lambda';
import { WatsonAssistantController } from '../controllers/watsonAssistant.controller';

/**
 * Receives and handles the Watson Assistant collected information
 * @param {APIGatewayEvent} event
 * @param {Context} context
 * @return {Promise<APIGatewayProxyResult>}
 */
module.exports.handler = (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

    context.callbackWaitsForEmptyEventLoop = false;
    return WatsonAssistantController.handler(event)
};

