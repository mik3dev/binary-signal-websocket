require('dotenv').load();
const PORT = process.env.PORT || 4000;
const OANDA_TOKEN = process.env.OANDA_TOKEN;
const OandaApiBaseURL = process.env.OandaApiBaseURL;
const TIMER = process.env.TIMER;
const ORIGIN = process.env.ORIGIN;
const numerOfRetrievingCandles = process.env.numerOfRetrievingCandles
const longStochK = process.env.longStochK;
const shortStochK = process.env.shortStochK;
const Stoch_D = process.env.Stoch_D;
const Stoch_Smooth = process.env.Stoch_Smooth;
const bolBandPeriod = process.env.bolBandPeriod;
const bolBandStdDev = process.env.bolBandStdDev;
const stochLowerLimit = process.env.stochLowerLimit;
const stochHigherLimit =process.env.stochHigherLimit;

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
    stochLowerLimit,
    stochHigherLimit
}