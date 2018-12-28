require('dotenv').load();
const PORT = process.env.PORT || 4000;
const OANDA_TOKEN = process.env.OANDA_TOKEN;
const OandaApiBaseURL = process.env.OandaApiBaseURL;
const TIMER = process.env.TIMER;
const ORIGIN = process.env.ORIGIN;

const numerOfRetrievingCandles = process.env.numerOfRetrievingCandles || 40;

const longStochK = process.env.longStochK || 14;
const shortStochK = process.env.shortStochK || 6;
const Stoch_D = process.env.Stoch_D || 3;
const Stoch_Smooth = process.env.Stoch_Smooth || 3;
const bolBandPeriod = process.env.bolBandPeriod || 20;
const bolBandStdDev = process.env.bolBandStdDev || 2;
const rsiPeriod = process.env.rsiPeriod || 14;
const stochRsi_Period = process.env.stochRsi_period || 14;
const stochRsi_K = process.env.stochRsi_K || 14;
const stochRsi_D = process.env.stochRsi_D || 3;
const stochRsi_Smooth = process.env.stochRsi_Smooth || 3;
const AOShortPeriod = process.env.AOShortPeriod || 4;
const AOLongPeriod = process.env.AOLongPeriod || 35;
const emaPeriod = process.env.emaPeriod || 18;
const wmaPeriod = process.env.wmaPeriod || 7;
const smaPeriod = process.env.smaPeriod || 25;

const stochLowerLimit = process.env.stochLowerLimit || 20;
const stochHigherLimit =process.env.stochHigherLimit || 80;
const stochRsiLowerLimit = process.env.stochRsiLowerLimit || 20
const stochRsiHigherLimit = process.env.stochRsiHigherLimit || 80
const rsiLowerLimit = process.env.rsiLowerLimit || 30
const rsiHigherLimit = process.env.rsiHigherLimit || 70

module.exports = {
    PORT,
    TIMER,
    ORIGIN,
    OANDA_TOKEN,
    OandaApiBaseURL,
    numerOfRetrievingCandles,
    longStochK,
    shortStochK,
    Stoch_D,
    Stoch_Smooth,
    bolBandPeriod,
    bolBandStdDev,
    rsiPeriod,
    stochRsi_Period,
    stochRsi_K,
    stochRsi_D,
    stochRsi_Smooth,
    AOShortPeriod,
    AOLongPeriod,
    smaPeriod,
    emaPeriod,
    wmaPeriod,
    stochLowerLimit,
    stochHigherLimit,
    stochRsiLowerLimit,
    stochRsiHigherLimit,
    rsiLowerLimit,
    rsiHigherLimit,
}