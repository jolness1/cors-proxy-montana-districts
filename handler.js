const axios = require('axios');

exports.handler = async (event) => {
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
            body: JSON.stringify({ error: 'Invalid endpoint' }),
        };
    }

    try {
        const response = await axios.get(url, { params: queryStringParameters });
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred' }),
        };
    }
};
