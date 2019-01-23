const config = require('../config');

class Signal {
    /* BOL_BAND: 0 */
    static validateBolBand(candle){
        let result = 'NEUTRAL';
        if(candle.open <= candle.indicatorBolBand.lowerBand) result = 'BUY';
        else if(candle.open >= candle.indicatorBolBand.upperBand) result = 'SELL';
        return result;
    }

    /* RSI_LIMIT: 1 */
    static validateRsi(candle) {
        let result = 'NEUTRAL';
        if(candle.indicatorRsi <= config.rsiLowerLimit) result = 'BUY';
        else if(candle.indicatorRsi >= config.rsiLowerLimit) result = 'SELL';
        return result;
    }

    /* STOCH_LIMIT_LONG: 2 */
    static validateStochLongLimit(candle){
        let result = 'NEUTRAL';
        if(candle.indicatorStochLong.stoch <= config.stochLowerLimit) result = 'BUY';
        else if(candle.indicatorStochLong.stoch >= config.stochLowerLimit) result = 'SELL';
        return result;
    }

    /* STOCH_CROSS_LONG: 3 */
    static validateStochLongCross(candle){
        let result = 'NEUTRAL'
        if(candle.indicatorStochLong.stoch > candle.indicatorStochLong.smooth) result = 'BUY';
        else if(candle.indicatorStochLong.stoch < candle.indicatorStochLong.smooth) result = 'SELL';
        return result;
    }

    /* STOCH_LIMIT_SHORT: 4 */
    static validateStochShortimit(candle){
        let result = 'NEUTRAL';
        if(candle.indicatorStochShort.stoch <= config.stochLowerLimit) result = 'BUY';
        else if(candle.indicatorStochShort.stoch >= config.stochLowerLimit) result = 'SELL';
        return result;
    }

    /* STOCH_CROSS_SHORT: 5 */
    static validateStochShortCross(candle){
        let result = 'NEUTRAL'
        if(candle.indicatorStochShort.stoch > candle.indicatorStochShort.smooth) result = 'BUY'
        else if(candle.indicatorStochShort.stoch < candle.indicatorStochShort.smooth) result = 'SELL'
        return result
    }

    /* STOCH_RSI_LIMIT: 6 */
    static validateStochRsiLimit(candle){
        let result = 'NEUTRAL';
        if(candle.indicatorStochRsi.stoch <= config.stochRsiLowerLimit) result = 'BUY';
        else if(candle.indicatorStochRsi.stoch >= config.stochHigherLimit) result = 'SELL';
        return result;
    }

    /* STOCH_RSI_CROSS: 7 */
    static validateStochRsiCross(candle){
        let result = 'NEUTRAL';
        if(candle.indicatorStochRsi.stoch > candle.indicatorStochRsi.smooth) result = 'BUY';
        else if(candle.indicatorStochRsi.stoch < candle.indicatorStochRsi.smooth) result = 'SELL';
        return result;
    }

    /* MA_CROSS: 8 */
    static validateMACross(candle){
        let result = 'NEUTRAL';
        if(candle.indicatorWma>candle.indicatorSma) result = 'BUY';
        else if(candle.indicatorWma<candle.indicatorSma) result = 'SELL';
        return result;
    }

    /* AWESOME_OSC: 9 */
    static validateAwesomeOsc(candle){
        let result = 'NEUTRAL';
        if(candle.indicatorAwesomeOsc>0) result = 'BUY';
        else if(candle.indicatorAwesomeOsc<0) result = 'SELL';
        return result;
    }

    /* PREV_STOCH_CROSS_LONG 10 */
    static validatePrevStochCrossLong(candle){
        let result = 'NEUTRAL'
        if(candle.prev.indicatorStochLong.stoch > candle.prev.indicatorStochLong.smooth) result = 'BUY';
        else if(candle.prev.indicatorStochLong.stoch < candle.prev.indicatorStochLong.smooth) result = 'SELL';
        return result;
    }

    /* PREV_STOCH_CROSS_SHORT 11 */
    static validatePrevStochCrossShort(candle){
        let result = 'NEUTRAL'
        if(candle.prev.indicatorStochShort.stoch > candle.prev.indicatorStochShort.smooth) result = 'BUY'
        else if(candle.prev.indicatorStochShort.stoch < candle.prev.indicatorStochShort.smooth) result = 'SELL'
        return result
    }

    /* PREV_STOCH_RSI_CROSS 12 */
    static validatePrevStochRsiCross(candle){
        let result = 'NEUTRAL';
        if(candle.prev.indicatorStochRsi.stoch > candle.prev.indicatorStochRsi.smooth) result = 'BUY';
        else if(candle.prev.indicatorStochRsi.stoch < candle.prev.indicatorStochRsi.smooth) result = 'SELL';
        return result;
    }
}

module.exports = Signal