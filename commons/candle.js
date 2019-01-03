const config = require('../config');
const _ = require('lodash');

class Candle {

    constructor (instrument, timeframe, candles){
        const candle = candles.candles[config.numerOfRetrievingCandles -1];
        this.instrument = instrument;
        this.timeframe = timeframe.name;
        this.flag = timeframe.flag;
        this.complete = candle.complete;
        this.volume = (candle.volume);
        this.time = candle.time;
        this.open = round(candle.mid.o);
        this.high = round(candle.mid.h);
        this.low = round(candle.mid.l);
        this.close = round(candle.mid.c);
        this.calculateIndicators(candles.candles);
        this.signal4High = signal4High(this.open, this.indicatorBolBand, this.indicatorStochLong, this.indicatorStochShort, this.rsi, this.stochRsi);
        this.signal4Mid = signal4Mid(this.indicatorStochLong, this.indicatorStochShort, this.stochRsi);
        this.signal4Low = signal4Low(this.indicatorWma, this.indicatorEma, this.indicatorSma, this.indicatorAwesomeOsc);
    }

    calculateIndicators(candles){
        const priceArray = _.map(candles, candle => {
            return {
                instrument: this.instrument,
                timeframe: this.timeframe,
                open: round(candle.mid.o),
                high: round(candle.mid.h),
                low: round(candle.mid.l),
                close: round(candle.mid.c)
            }
        })
        this.indicatorStochLong = calcStoch(priceArray, config.longStochK);
        this.indicatorStochShort = calcStoch(priceArray, config.shortStochK);
        this.indicatorBolBand = calcBolBand(priceArray, config.bolBandPeriod, config.bolBandStdDev);
        this.rsi = calcRSI(priceArray, config.rsiPeriod);
        this.stochRsi = calcStochRsi(priceArray);
        this.indicatorAwesomeOsc = calcAwesomeOsc(priceArray, config.AOLongPeriod, config.AOShortPeriod);
        this.indicatorEma = calcEma(priceArray, config.emaPeriod);
        this.indicatorSma = calcSma(priceArray, config.smaPeriod);
        this.indicatorWma = calcWma(priceArray, config.wmaPeriod);
    }
}

/* Sctochastic function */
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

/* RSI function */
function calcRSI(serie, period, returnAll=false){
    let deltaArr = [];
    for(let i=0; i<serie.length; i++){
        if(i==0) deltaArr.push(0)
        else deltaArr.push(serie[i].close - serie[i-1].close)
    }

    let avgGain = 0;
    let avgLoss = 0;
    let rsiArr = [];

    for(let index=0; index<serie.length; index++){
        if(index < (period-1)) {
            rsiArr.push(0);
        } else {
            let gain = 0;
            let loss = 0;
            if(index == (period-1)) {
                for(let i=index-period+1; i<=index; i++){
                    if(deltaArr[i] > 0) gain += deltaArr[i]
                    else loss += Math.abs(deltaArr[i])
                }
                avgGain = gain / period;
                avgLoss = loss / period;
                rsiArr.push(100 - (100/(1+(avgGain/avgLoss))))
            } else {
                let gain = 0;
                let loss = 0;
                if(deltaArr[index]>0) gain = deltaArr[index]
                else loss = Math.abs(deltaArr[index])

                avgGain = (avgGain*(period-1) + gain)/period;
                avgLoss = (avgLoss*(period-1) + loss)/period;
                rsiArr.push(100 - (100/(1+(avgGain/avgLoss))))
            }
        }
    }

    if(returnAll){
        return rsiArr
    } else {
        return rsiArr[serie.length-1]
    }
}

/* Stochastic RSI function */
function calcStochRsi(serie, rsiPeriod = config.stochRsi_Period, k4Stoch=config.stochRsi_K, d4Stoch=config.stochRsi_D, smooth4Stoch=config.stochRsi_Smooth){
    const rsiArr = calcRSI(serie,rsiPeriod, true);
    const stochRsiArr = _.map(rsiArr, (item, index, arr) => {
        if(index < k4Stoch-1) return 0;
        else {
            let subSerie = [];

            for(let i=index-1; i>index-k4Stoch; i--){
                subSerie.push(rsiArr[i]);
            }
            return ((item - _.min(subSerie)) / (_.max(subSerie) - _.min(subSerie))) * 100;
        }
    });

    let sum;

    let smoothStochArr = [];
    for(let i=stochRsiArr.length-d4Stoch; i<stochRsiArr.length; i++){
        sum = 0;
        for(let j=i-d4Stoch+1; j<=i;  j++){
            sum+=stochRsiArr[j];
        }
        smoothStochArr.push(sum/d4Stoch);
    }
    
    sum=0;
    for(let i=smoothStochArr.length-smooth4Stoch; i<smoothStochArr.length; i++){
        sum+=smoothStochArr[i];
    }
    const smoothedStochRsi = sum/smooth4Stoch;
    return {
        stochRsi: smoothStochArr[smoothStochArr.length-1],
        smoothedStochRsi
    }
}

/* Simple Moving Average function */
function calcSma(serie, period){
    let sum = 0;
    for(let i=serie.length-period; i<serie.length; i++){
        sum += Number.parseFloat(serie[i].close);
    }
    return sum/period;
}

/* Bollinger Band function */
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

/* Exponential Moving Average function */
function calcEma(serie, period=config.emaPeriod){
    const kFactor = 2/(period+1);
    let previousEma = 0;
    const emaArray = _.map(serie, (item, index) => {
        if(index == 0){
            previousEma = item.close;
            return item.close;
        } else {
            const ema = (item.close * kFactor) + (previousEma * (1-kFactor));
            previousEma = ema;
            return ema;
        }
    });
    return emaArray[emaArray.length - 1];
}

/* Weighted Moving Average function */
function calcWma(serie, period=config.wmaPeriod){
    let sum = 0;
    let total = 0;
    let count = 0;
    for(let i=1; i<=period; i++){
        total += i;
    }
    for(let i=serie.length-period; i<serie.length; i++){
        count++;
        sum += serie[i].close*(count/total);
    }
    return sum;
}

/* Awesome Oscilatior function  */
function calcAwesomeOsc(serie, longPeriod=config.AOLongPeriod, shortPeriod=config.AOShortPeriod){
    let sum = 0;
    for(let i=serie.length-longPeriod; i<serie.length; i++){
        sum += (serie[i].high + serie[i].low)/2;
    }
    const longSma = sum / longPeriod;

    sum = 0;
    for(let i=serie.length-shortPeriod; i<serie.length; i++){
        sum += (serie[i].high + serie[i].low)/2;
    }
    const shortSma = sum / shortPeriod;

    return shortSma - longSma;
}

function signal4High(open, bolBand, stochLong, stochShort, rsi, stochRsi){
    if(
        open >= bolBand.upperBand && 
        stochLong.stoch >= config.stochHigherLimit && 
        stochShort.stoch >= config.stochHigherLimit && 
        rsi >= config.rsiHigherLimit &&
        stochRsi.stochRsi >= config.stochRsiHigherLimit)
    {
        return 'SELL'
    } else if(
        open <= bolBand.lowerBand && 
        stochLong.stoch <= config.stochLowerLimit && 
        stochShort.stoch<=config.stochLowerLimit &&
        rsi <= config.rsiLowerLimit &&
        stochRsi.stochRsi <= config.stochRsiLowerLimit)
    {
        return 'BUY'
    } else {
        return 'NEUTRAL'
    }
}

function signal4Mid(stochLong, stochShort, stochRsi){
    if(
        stochLong.stoch > stochLong.smoothedStoch && 
        stochShort.stoch > stochShort.smoothedStoch &&
        stochRsi.stochRsi > stochRsi.smoothedStochRsi)
    {
        return 'BUY'
    } else if(
        stochLong.stoch < stochLong.smoothedStoch && 
        stochShort.stoch < stochShort.smoothedStoch &&
        stochRsi.stochRsi < stochRsi.smoothedStochRsi)
    {
        return 'SELL'
    } else {
        return 'NEUTRAL'
    }
}

function signal4Low(wma, ema, sma, awesomeOsc){
    if(wma<ema && wma<sma && awesomeOsc<0){
        return 'SELL'
    } else if(wma>ema && wma>sma &&awesomeOsc>0){
        return 'BUY'
    } else {
        return 'NEUTRAL'
    }
}

function signalA(open, bolBand, stochLong, stochShort, rsi, stochRsi){
    if(
        open >= bolBand.upperBand && 
        stochLong.stoch >= config.stochHigherLimit && 
        stochShort.stoch >= config.stochHigherLimit && 
        rsi >= config.rsiHigherLimit &&
        stochRsi.stochRsi >= config.stochRsiHigherLimit)
    {
        return 'SELL'
    } else if(
        open <= bolBand.lowerBand && 
        stochLong.stoch <= config.stochLowerLimit && 
        stochShort.stoch<=config.stochLowerLimit &&
        rsi <= config.rsiLowerLimit &&
        stochRsi.stochRsi <= config.stochRsiLowerLimit)
    {
        return 'BUY'
    } else {
        return 'NEUTRAL'
    }
}

function signalB(stochLong, stochShort, stochRsi){
    if(
        stochLong.stoch > stochLong.smoothedStoch && 
        stochShort.stoch > stochShort.smoothedStoch &&
        stochRsi.stochRsi > stochRsi.smoothedStochRsi)
    {
        return 'BUY'
    } else if(
        stochLong.stoch < stochLong.smoothedStoch && 
        stochShort.stoch < stochShort.smoothedStoch &&
        stochRsi.stochRsi < stochRsi.smoothedStochRsi)
    {
        return 'SELL'
    } else {
        return 'NEUTRAL'
    }
}

function round (value, numDecimal=5) {
    return Math.round(value*Math.pow(10,numDecimal))/Math.pow(10,numDecimal)
};
module.exports = Candle;
