const axios = require('axios');
const config = require('../config');
const TOKEN = config.OANDA_TOKEN;
const baseURL = config.OandaApiBaseURL;

module.exports =  {
    getCandles(instrument, timeFrame, count=1){
        const connectionString = `${baseURL}/v3/instruments/${instrument}/candles?granularity=${timeFrame}&count=${count}`;
        return axios({
            method: 'get',
            url: connectionString,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'content-type': 'Application/json'
            }
        });
    }
}