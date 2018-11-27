const config = require('../config');
const _ = require('lodash');

class Candle {

    constructor (instrument, timeframe, candles){
        const candle = candles.candles[config.numerOfRetrievingCandles -1];
        this.instrument = instrument;
        this.timeframe = timeframe;
        this.complete = candle.complete;
        this.volume = Number.parseInt(candle.volume);
        this.time = candle.time;
        this.open = Number.parseFloat(candle.mid.o);
        this.high = Number.parseFloat(candle.mid.h);
        this.low = Number.parseFloat(candle.mid.l);
        this.close = Number.parseFloat(candle.mid.c);
        this.indicatorStochLong = 0;
        this.indicatorStochShort = 0;
        this.indicatorBolBand = 0;
        this.calculateIndicators(candles.candles);
        this.signalA = signalA(this.open, this.indicatorBolBand, this.indicatorStochLong, this.indicatorStochShort);
        this.signalB = signalB(this.indicatorStochLong, this.indicatorStochShort);
    }

    calculateIndicators(candles){
        const priceArray = _.map(candles, candle => {
            return {
                open: Number.parseFloat(candle.mid.o),
                high: Number.parseFloat(candle.mid.h),
                low: Number.parseFloat(candle.mid.l),
                close: Number.parseFloat(candle.mid.c)
            }
        })
        this.indicatorStochLong = calcStoch(priceArray, config.longStochK);
        this.indicatorStochShort = calcStoch(priceArray, config.shortStochK);
        this.indicatorBolBand = calcBolBand(priceArray, config.bolBandPeriod, config.bolBandStdDev);
    }
}

function calcStoch(serie, k=config.longStochK, d=config.Stoch_D, smooth=config.Stoch_Smooth){
    let stochArray = _.map(serie, (item, index) => {
        if(index < serie.length-k) return 0;
        else {
            let subSerie = [];
            let close;
            for(let i=index; i>index-k; i--){
                if(i==index) close = serie[i].close;
                subSerie.push(serie[i]);
            }
            return ((close - _.minBy(subSerie, 'low').low) / (_.maxBy(subSerie, 'high').high - _.minBy(subSerie, 'low').low)) * 100;
        }
    });

    let sum;

    let smoothStochArr = [];
    for(let i=stochArray.length-d; i<stochArray.length; i++){
        sum = 0;
        for(let j=i-d+1; j<=i;  j++){
            sum+=stochArray[j];
        }
        smoothStochArr.push(sum/d);
    }
    
    sum=0;
    for(let i=smoothStochArr.length-smooth; i<smoothStochArr.length; i++){
        sum+=smoothStochArr[i];
    }
    const smoothedStoch = sum/smooth;

    return {
        stoch: smoothStochArr[smoothStochArr.length-1],
        smoothedStoch
    }
}

function calcSma(serie, period){
    let sum = 0;
    for(let i=serie.length-period; i<serie.length; i++){
        sum += Number.parseFloat(serie[i].close);
    }
    return sum/period;
}

function calcBolBand(serie, period=config.bolBandPeriod, stdDev=config.bolBandStdDev){
    const mean = calcSma(serie, period);
    let sum = 0;
    for(let i=serie.length-period; i<serie.length; i++){
        sum += Math.pow((serie[i].close - mean), 2);
    }
    const variance = sum / period;
    const sd = stdDev * Math.sqrt(variance);
    return {
        bolBand: mean,
        upperBand: mean + sd,
        lowerBand: mean - sd,
    }
}

function signalA(open, bolBand, stochLong, stochShort){
    if(open>=bolBand.upperBand && stochLong.stoch>=config.stochHigherLimit && stochShort.stoch>=config.stochHigherLimit){
        return 'SELL'
    } else if(open<=bolBand.lowerBand && stochLong.stoch<=config.stochLowerLimit && stochShort.stoch<=config.stochLowerLimit){
        return 'BUY'
    } else {
        return 'NEUTRAL'
    }
}

function signalB(stochLong, stochShort){
    if(stochLong.stoch > stochLong.smoothedStoch && stochShort.stoch > stochShort.smoothedStoch){
        return 'BUY'
    } else if(stochLong.stoch < stochLong.smoothedStoch && stochShort.stoch < stochShort.smoothedStoch){
        return 'SELL'
    } else {
        return 'NEUTRAL'
    }
}

module.exports = Candle;