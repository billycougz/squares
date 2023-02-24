const { handleGet, handlePost, handleUpdate } = require('./handlers.js');

exports.handler = async (event, context) => {
	// Hello Billy
	//console.log('Received event:', JSON.stringify(event, null, 2));
	let body;
	let statusCode = '200';

	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': '*',
		'Access-Control-Allow-Methods': '*',
	};

	const headers = {
		'Content-Type': 'application/json',
		...corsHeaders,
	};

	try {
		switch (event.httpMethod) {
			case 'GET':
				body = await handleGet(event);
				break;
			case 'POST':
				body = await handlePost(event);
				break;
			case 'PUT':
				body = await handleUpdate(event);
				break;
			case 'OPTIONS':
				body = {};
				break;
			default:
				throw new Error(`Unsupported method "${event.httpMethod}"`);
		}
	} catch (err) {
		statusCode = '400';
		body = err.message;
	} finally {
		body = JSON.stringify(body);
	}

	return {
		statusCode,
		body,
		headers,
	};
};
// aws lambda update-function-code --function-name squares-function --zip-file fileb://./my-deployment-package.zip
// zip -r my-deployment-package.zip *