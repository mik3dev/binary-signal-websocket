class Indicators {

    /* Simple moving average calculation */
    static calcSma(serie, period, returnArray=false){
        const result = serie.map((item, index, arr) => {
            if(index < period-1){
                return 0;
            } else {
                let sum = 0;
                for(let i=index-period+1; i<=index; i++){
                    sum += arr[i];
                }
                return sum / period;
            }
        })
        if(returnArray) return result;
        return result[result.length-1];
    } 

    /* Exponential moving average calculation */
    static calcEma(serie, period, returnArray=false){
        const kFactor = 2/(period + 1);
        let prevEma = 0;
        const result = serie.map((item, index, arr) => {
            if(index < period-1){
                return 0;
            } else if(index == period-1) {
                const subArr = arr.filter((subItem, subIndex) => {
                    return subIndex <= period;
                })
                prevEma = this.calcSma(subArr, period);
                return prevEma;
            } else {
                prevEma = ((item - prevEma) * kFactor) + prevEma;
                return prevEma;
            }
        })
        if(returnArray) return result;
        return result[result.length-1];
    }

    /* Weighted moving average calculation */
    static calcWma(serie, period, returnArray=false){
        let total = 0;
        for(let i=1; i<=period; i++){
            total += i;
        }

        const result = serie.map((item, index, arr) => {
            if(index < period-1){
                return 0;
            } else {
                let sum = 0;
                let count = 0;
                for(let i=index-period+1; i<=index; i++){
                    count++;
                    sum += arr[i]*(count/total);
                }
                return sum;
            }
        })
        if(returnArray) return result;
        return result[result.length-1];
    }

    /* Bollinger bands calculation */
    static calcBolBand(serie, period, stdDev, returnArray=false){
        const mean = this.calcSma(serie, period);
        const result = serie.map((item, index, arr) => {
            if(index < period-1){
                return {
                    bolBand: 0,
                    upperBand: 0,
                    lowerBand: 0,
                }
            } else {
                let variance = 0;
                for(let i=index-period+1; i<=index; i++){
                    variance += Math.pow(arr[i]-mean, 2);
                }
                variance = variance/period;
                const standarDev = stdDev * Math.sqrt(variance);
                return {
                    bolBand: mean,
                    upperBand: mean + standarDev,
                    lowerBand: mean - standarDev,
                }
            }
        })

        if(returnArray) return result;
        return result[result.length-1];
    }

    /* Sctochastic calculation */
    static calcStoch(closeSerie, highSerie, lowSerie, k, d, s, returnArray=false){
        const rawStoch = closeSerie.map((item, index, arr) => {
            if(index < k-1) {
                return 0;
            } else {
                const subHigh = highSerie.slice(index-k+1, index+1);
                const subLow = lowSerie.slice(index-k+1, index+1);

                const higherHigh = subHigh.reduce((a,b) => {
                    return Math.max(a, b);
                })
                const lowerLow = subLow.reduce((a,b) => {
                    return Math.min(a, b);
                })

                return ((item - lowerLow)/(higherHigh - lowerLow))*100;
            }
        })
        const stoch = this.calcSma(rawStoch, d, true);
        const smoothStoch = this.calcSma(stoch, d, true);
        const result = stoch.map((item, index) => {
            return {
                stoch: item,
                smooth: smoothStoch[index]
            }
        })
        
        if(returnArray) {
            return result;
        }
        return result[result.length-1];
    }

    /* RSI calculation */
    static calcRsi(serie, period, returnArray=false){
        const diffArr = serie.map((item, index, arr) => {
            if(index == 0) return 0;
            else return item - arr[index-1]
        });

        let prevAvgGain = 0;
        let prevAvgLoss = 0;
        
        const result = diffArr.map((item, index, arr) => {
            if(index < period-1) {
                return 0;
            } else {
                if(index === period-1){
                    const subArr = arr.slice(index-period+1, index+1);

                    const gain = subArr.reduce((accumulator, currentValue) => {
                        if(currentValue > 0) return accumulator + currentValue;
                    });

                    const loss = subArr.reduce((accumulator, currentValue) => {
                        if(currentValue < 0) return accumulator + Math.abs(currentValue);
                    });

                    const prevAvgGain = gain/period;
                    const prevAvgLoss = loss/period;    

                    return 100 - (100/(1+(prevAvgGain/prevAvgLoss)));
                } else {
                    let currentGain = 0;
                    let currentLoss = 0;

                    if(item > 0) currentGain = item;
                    if(item < 0) currentLoss = Math.abs(item);

                    prevAvgGain = (prevAvgGain*(period-1)+currentGain)/period
                    prevAvgLoss = (prevAvgLoss*(period-1)+currentLoss)/period

                    return 100 - (100/(1+((prevAvgGain/period)/(prevAvgLoss/period))));
                }
            }
        });

        if(returnArray) return result;
        return result[result.length-1];
    }

    /* Stochastic rsi calculation */
    static calcStochRsi(serie, rsiPeriod, k4Stoch, d4Stoch, smooth4Stoch, returnArray=false){
        const rsiArr = this.calcRsi(serie, rsiPeriod, true);
        const result = this.calcStoch(rsiArr, rsiArr, rsiArr, k4Stoch, d4Stoch, smooth4Stoch, true)
        if(returnArray) return result;
        return result[result.length-1];
    }

    /* Aswesome oscilator calculation */
    static calcAwesomeOsc(serieHigh, serieLow, longPeriod, shortPeriod, returnArray=false){
        const avgSerie = serieHigh.map((item, index) => {
            return (item + serieLow[index])/2;
        });

        const longSma = this.calcSma(avgSerie, longPeriod, true);
        const shortSma = this.calcSma(avgSerie, shortPeriod, true);

        const result = shortSma.map((item, index) => {
            return item - longSma[index];
        }) 

        if(returnArray) return result;
        return result[result.length-1];
    }
}

module.exports = Indicators