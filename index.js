const express = require('express');
const socketIO = require('socket.io');
const logger = require('morgan');
const path = require('path')
const _ = require('lodash');
const cors = require('cors');

const config = require('./config');
const oandaConnection = require('./commons/oandaConnection');
const Candle = require('./commons/candle');
const instruments = config.Instruments;
const timeframes = config.Timeframes;

const server = express()
    .use(cors({
        'origin': config.ORIGIN
    }))
    .use(logger('dev'))
    .use(express.json())
    .use(express.static(path.join(__dirname, 'public')))
    .listen(config.PORT, () => console.log(`Listening on ${ config.PORT }`));

const io = socketIO(server);
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval( () => {
    let promises = [];
    _.forEach(instruments, instrument => {
        _.forEach(timeframes, timeframe => {
            promises.push(new Promise((resolve, reject) => {
                oandaConnection.getCandles(instrument, timeframe.name, config.numerOfRetrievingCandles)
                .then(resp => {
                    resolve(new Candle(instrument, timeframe, resp.data));
                })
                .catch(e => reject({
                    'error': `Problem to load symbol: ${instrument} - timeframe: ${timeframe.name} Data: ${e}`
                }))
            }))
        })
    })
    Promise.all(promises).then(r => io.emit('fxData', r)).catch(e => console.log(e));
}, config.TIMER);