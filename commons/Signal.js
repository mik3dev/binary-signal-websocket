const config = require('../config');

class Signal {
    /* BOL_BAND: 0 */
    static validateBolBand(candle){
        if(candle.open <= candle.indicatorBolBand.upperBand) return 'BUY'
        else if(candle.open >= candle.indicatorBolBand.lowerBand) return 'SELL'
        else return 'NEUTRAL'
    }

    /* RSI_LIMIT: 1 */
    static validateRsi(candle) {
        if(candle.indicatorRsi <= config.rsiLowerLimit) return 'BUY'
        else if(candle.indicatorRsi >= config.rsiLowerLimit) return 'SELL'
        else return 'NEUTRAL'
    }

    /* STOCH_LIMIT_LONG: 2 */
    static validateStochLongLimit(candle){
        if(candle.indicatorStochLong.stoch <= config.stochLowerLimit) return 'BUY'
        else if(candle.indicatorStochLong.stoch >= config.stochLowerLimit) return 'SELL'
        else return 'NEUTRAL'
    }

    /* STOCH_CROSS_LONG: 3 */
    static validateStochLongCross(candle){
        if(candle.indicatorStochLong.stoch > candle.indicatorStochLong.smooth) return 'BUY'
        else if(candle.indicatorStochLong.stoch < candle.indicatorStochLong.smooth) return 'SELL'
        else return 'NEUTRAL'
    }

    /* STOCH_LIMIT_SHORT: 4 */
    static validateStochLongLimit(candle){
        if(candle.indicatorStochShort.stoch <= config.stochLowerLimit) return 'BUY'
        else if(candle.indicatorStochShort.stoch >= config.stochLowerLimit) return 'SELL'
        else return 'NEUTRAL'
    }

    /* STOCH_CROSS_SHORT: 5 */
    static validateStochLongCross(candle){
        if(candle.indicatorStochShort.stoch > candle.indicatorStochShort.smooth) return 'BUY'
        else if(candle.indicatorStochShort.stoch < candle.indicatorStochShort.smooth) return 'SELL'
        else return 'NEUTRAL'
    }

    /* STOCH_RSI_LIMIT: 6 */
    static validateStochLongLimit(candle){
        if(candle.indicatorStochRsi.stoch <= config.stochRsiLowerLimit) return 'BUY'
        else if(candle.indicatorStochRsi.stoch >= config.stochHigherLimit) return 'SELL'
        else return 'NEUTRAL'
    }

    /* STOCH_RSI_CROSS: 7 */
    static validateStochLongCross(candle){
        if(candle.indicatorStochRsi.stoch > candle.indicatorStochRsi.smooth) return 'BUY'
        else if(candle.indicatorStochRsi.stoch < candle.indicatorStochRsi.smooth) return 'SELL'
        else return 'NEUTRAL'
    }

    /* MA_CROSS: 8 */
    static validateMACross(candle){
        if(candle.indicatorWma>candle.indicatorSma) return 'BUY'
        else if(candle.indicatorWma<candle.indicatorSma) return 'SELL'
        else return 'NEUTRAL'
    }

    /* AWESOME_OSC: 9 */
    static validateAwesomeOsc(candle){
        if(candle.indicatorAwesomeOsc>0) return 'BUY'
        else if(candle.indicatorAwesomeOsc<0) return 'SELL'
        else return 'NEUTRAL'
    }
}

module.exports = Signal