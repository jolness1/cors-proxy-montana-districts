const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.get('*', async (req, res) => {
    const path = req.path;
    const queryStringParameters = req.query;

    let url;
    if (path.includes('hd-lookup')) {
        url = 'https://gisservicemt.gov/arcgis/rest/services/MSDI_Framework/Boundaries/MapServer/62/query';
    } else if (path.includes('congressional-lookup')) {
        url = 'https://gisservicemt.gov/arcgis/rest/services/MSDI_Framework/Boundaries/MapServer/34/query';
    } else if (path.includes('geocode')) {
        url = 'https://gisservicemt.gov/arcgis/rest/services/MSDI_Framework/MontanaAddressLocator/GeocodeServer/findAddressCandidates';
    } else {
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    try {
        const response = await axios.get(url, { params: queryStringParameters });
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
