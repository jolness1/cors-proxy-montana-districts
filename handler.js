const axios = require('axios');

exports.handler = async (event) => {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '', // No body needed with OPTIONS
        };
    }

    const queryStringParameters = event.queryStringParameters || {};
    const path = event.path;
    
    let url;
    if (path.includes('hd-lookup')) {
        url = 'https://gisservicemt.gov/arcgis/rest/services/MSDI_Framework/Boundaries/MapServer/62/query';
    } else if (path.includes('congressional-lookup')) {
        url = 'https://gisservicemt.gov/arcgis/rest/services/MSDI_Framework/Boundaries/MapServer/34/query';
    } else if (path.includes('geocode')) {
        url = 'https://gisservicemt.gov/arcgis/rest/services/MSDI_Framework/MontanaAddressLocator/GeocodeServer/findAddressCandidates';
    } else {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
            body: JSON.stringify({ error: 'Invalid endpoint',
            message: error.message,
            details: error.response ? error.response.data : null
            }),
        };
    }

    try {
        const response = await axios.get(url, { 
            params: queryStringParameters,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: error.response ? error.response.status : 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                error: 'An error occurred', 
                message: error.message,
                details: error.response ? error.response.data : null
            }),
        };
    }
};