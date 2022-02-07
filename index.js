const _ = require('lodash');
const Alpaca = require('@alpacahq/alpaca-trade-api');
//const SMA = require('technicalindicators').SMA;
const MACD = require('technicalindicators').MACD;
const PSAR = require('technicalindicators').PSAR;
const EMA = require('technicalindicators').EMA;
const dotenv = require('dotenv');
dotenv.config();

const alpaca = new Alpaca({
  keyId: process.env.API_KEY,
  secretKey: process.env.SECRET_API_KEY,
  paper: true,
  usePolygon: false
});

//let sma20, sma50;
let macd, ema200, psar;
let lastOrder = 'SELL';
let stock = "AAPL";
let holding = [];
let resTrades = [];

async function initializeData() {
  const dateDayBefore = new Date(2021, 11, 31, 9);
  const dateNext= new Date(2021, 11, 31, 16);
  //console.log(dateDayBefore.toString()+" "+dateNext.toString());

  const initialData = alpaca.getBarsV2(
    stock,
    {
        start: dateDayBefore.toISOString(),
        end: dateNext.toISOString(),
        limit: 400,
        timeframe: "1Min",
        adjustment: "all",
    },
    alpaca.configuration
  );

  const close = [];
  const high = [];
  const low = [];
  
  for await (let b of initialData) {
    //console.log(b.ClosePrice);
    close.push(b.ClosePrice);
    high.push(b.HighPrice);
    low.push(b.LowPrice);
  }

  const macdInput = {
    values            : close,
    fastPeriod        : 12,
    slowPeriod        : 26,
    signalPeriod      : 9,
    SimpleMAOscillator: false,
    SimpleMASignal    : false
  }

  const psarInput = {
    high: high,
    low: low,
    step: 0.02,
    max: 0.2
  }

  const emaInput = {
    period : 200,
    values : close
  }
  
  psar = new PSAR(psarInput);
  ema200 = new EMA(emaInput);
  macd = new MACD(macdInput);
}

// Submit a limit order if quantity is above 0.
async function submitLimitOrder(quantity, stock, price, side){
  if(quantity > 0){
    await this.alpaca.createOrder({
      symbol: stock, 
      qty: quantity, 
      side: side, 
      type: 'limit', 
      time_in_force: 'day', 
      limit_price: price
    }).then((resp) => {
      this.lastOrder = resp;
      console.log("Limit order of |" + quantity + " " + stock + " " + side + "| sent.");
    }).catch((err) => {
      console.log("Order of |" + quantity + " " + stock + " " + side + "| did not go through.");
    });
  }
  else {
    console.log("Quantity is <=0, order of |" + quantity + " " + stock + " " + side + "| not sent.");
  }
}

// Submit a market order if quantity is above 0.
async function submitMarketOrder(quantity, stock, side){
  if(quantity > 0){
    await this.alpaca.createOrder({
      symbol: stock, 
      qty: quantity, 
      side: side, 
      type: 'market', 
      time_in_force: 'day'
    }).then((resp) => {
      this.lastOrder = resp;
      console.log("Market order of |" + quantity + " " + stock + " " + side + "| completed.");
    }).catch((err) => {
      console.log("Order of |" + quantity + " " + stock + " " + side + "| did not go through.");
    });
  }
  else {
    console.log("Quantity is <=0, order of |" + quantity + " " + stock + " " + side + "| not sent.");
  }
}

initializeData();

const client = alpaca.data_ws;

client.onConnect(() => {
  client.subscribe(['alpacadatav1/AM.'+stock]);
  setTimeout(() => client.disconnect(), 6000*1000);
});

client.onStockAggMin((subject, data) => {
  console.log(`Open Price: ${data.openPrice} Close Price: ${data.closePrice} High Price: ${data.highPrice} Low Price: ${data.lowPrice}`);
  const currClose = data.closePrice;
  const currHigh = data.highPrice;
  const currLow = data.lowPrice;
  const nextEma = ema200.nextValue(currClose);
  const nextPsar = psar.nextValue({high: currHigh, low: currLow});
  const nextMacd = macd.nextValue(currClose);
  const indexRemove = []

  for (let i = 0; i < holding.length; i++){
    if (currClose >= holding[i][3]){
      indexRemove.push(i);
      console.log(`sold 10 stocks of ${stock} at ${currClose} at a ${(currClose/holding[i][0])*100}% profit margin`);
      resTrades.push((currClose/holding[i][0])*100);
    } else if(currClose <= holding[i][2]){
      indexRemove.push(i);
      console.log(`sold 10 stocks of ${stock} at ${currClose} with ${100 - (currClose/holding[i][0])*100}% loss`);
      resTrades.push(-100 + (currClose/holding[i][0])*100);
    }
  }

  for (let i = indexRemove.length - 1; i >= 0; i--){
    holding.splice(indexRemove[i], 1);
  }

  if (holding.length < 11){
    if (currClose > nextEma && currClose> nextPsar && nextMacd.MACD > nextMacd.signal){
      console.log(`Bought 10 stocks of ${stock} at ${currClose}`);
      holding.push([currClose, 10, nextPsar, currClose + (currClose - nextPsar)]);
    }
  }

});

client.connect();

client.onStateChange((newState) => {
  console.log(`State changed to ${newState}`);
});

client.onDisconnect(() => {
  client.subscribe(['alpacadatav1/AM.'+stock]);
  setTimeout(() => client.disconnect(), 6000*1000);
});

client.onStockTrades(function (subject, data) {
  console.log(`Stock trades: ${subject}, price: ${data.price}`);
});