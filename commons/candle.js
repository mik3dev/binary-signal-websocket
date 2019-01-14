const config = require('../config');
const Indicators = require('./Indicators')
const Signal = require('./Signal');
const OPTION_ENUM = require('./OptionEnum');

class Candle {

    constructor (instrument, timeframe, candles){
        const candle = candles.candles[config.numerOfRetrievingCandles -1];
        const ArrayOfCandles = this.generatePriceArray(candles.candles);

        // Candle
        this.instrument = instrument;
        this.timeframe = timeframe.name;
        this.flag = timeframe.flag;
        this.complete = candle.complete;
        this.time = candle.time;
        this.volume = Number.parseInt(candle.volume);
        this.open = Number.parseFloat(candle.mid.o);
        this.high = Number.parseFloat(candle.mid.h);
        this.low = Number.parseFloat(candle.mid.l);
        this.close = Number.parseFloat(candle.mid.c);

        // Indicators
        this.indicatorSma = Indicators.calcSma(ArrayOfCandles.close, config.smaPeriod);
        this.indicatorEma = Indicators.calcEma(ArrayOfCandles.close, config.emaPeriod);
        this.indicatorWma = Indicators.calcWma(ArrayOfCandles.close, config.wmaPeriod);
        this.indicatorBolBand = Indicators.calcBolBand(ArrayOfCandles.close, config.bolBandPeriod, config.bolBandStdDev);
        this.indicatorStochLong = Indicators.calcStoch(ArrayOfCandles.close, ArrayOfCandles.high, ArrayOfCandles.low, config.longStochK, config.Stoch_D, config.Stoch_Smooth);
        this.indicatorStochShort = Indicators.calcStoch(ArrayOfCandles.close, ArrayOfCandles.high, ArrayOfCandles.low, config.shortStochK, config.Stoch_D, config.Stoch_Smooth);
        this.indicatorRsi = Indicators.calcRsi(ArrayOfCandles.close, config.rsiPeriod);
        this.indicatorStochRsi = Indicators.calcStochRsi(ArrayOfCandles.close, config.stochRsi_Period, config.stochRsi_K, config.stochRsi_D, config.stochRsi_Smooth);
        this.indicatorAwesomeOsc = Indicators.calcAwesomeOsc(ArrayOfCandles.high, ArrayOfCandles.low, config.AOLongPeriod, config.AOShortPeriod);
        
        //Signals
        this.signal = this.generateSignals() || 'NEUTRAL';
    }
    
    generatePriceArray(candles){
        let open = []; 
        let high = []; 
        let low = []; 
        let close = [];
        candles.forEach(item => {
            open.push(Number.parseFloat(item.mid.o));
            high.push(Number.parseFloat(item.mid.h));
            low.push(Number.parseFloat(item.mid.l));
            close.push(Number.parseFloat(item.mid.c));
        })
        return {
            open,
            high,
            low,
            close
        }
    }

    generateSignals(){
        const timeframe = config.Timeframes.filter(item => item.flag == this.flag);
        if(timeframe[0].modes.length === 0) return 'NONE';
        else {
            const arrayOfFunctions = [
                Signal.validateBolBand, // 0
                Signal.validateRsi, // 1
                Signal.validateStochLongLimit, // 2
                Signal.validateStochLongCross, // 3
                Signal.validateStochShortimit, // 4
                Signal.validateStochShortCross, // 5
                Signal.validateStochRsiLimit, // 6
                Signal.validateStochRsiCross, // 7
                Signal.validateMACross, // 8
                Signal.validateAwesomeOsc //9
            ]

            // if(this.instrument == "EUR_USD" && this.flag=="High") console.log(timeframe[0].modes)
            const signalArr = timeframe[0].modes.map(item => {
                // if(this.instrument == "EUR_USD" && this.flag=="High") console.log(OPTION_ENUM[item])
                return arrayOfFunctions[OPTION_ENUM[item]](this)
            })
            
            const totalCount = signalArr.length;
            const neutralCount = signalArr.filter(signal => signal === "NEUTRAL").length;
            if(neutralCount>0) return 'NEUTRAL';
            else {
                const sellCount = signalArr.filter(signal => signal === "SELL").length;
                if(sellCount == totalCount) return 'SELL';
                else {
                    const buyCount = signalArr.filter(signal => signal === "BUY").length;
                    if(buyCount == totalCount) return 'BUY';
                }
            }
        }
    }
}

module.exports = Candle;
