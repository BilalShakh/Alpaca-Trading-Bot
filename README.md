
# Alpaca Trading Bot

A real-time algorithmic trading bot that uses the Alpaca API to execute stock trades based on technical indicators like MACD, EMA (200), and PSAR.

## 🎥 Demo 
[![Demo Video](https://img.shields.io/badge/Watch%20Demo-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=hoaRQoU7iuE)

The [demo video](https://www.youtube.com/watch?v=hoaRQoU7iuE) provides a walkthrough of the Alpaca trading bot in action, featuring:
- Real-time stock price monitoring
- Buy and sell operations based on technical indicators
- Detailed logging of trade results
- Profit and loss calculation for each trade

## 🏗️ Architecture Summary

### Architecture
- **Node.js** for backend logic
- **Alpaca API** for stock trading integration
- **Technical Indicators** (MACD, EMA, PSAR)
- **WebSocket** for real-time market data updates
- Paper trading environment for testing strategies


## 🚀 Features

### Real-Time Trading
- Uses Alpaca's WebSocket to subscribe to live stock data and make trades based on indicators:
  - **MACD**: Used for trend-following signals.
  - **EMA (200)**: Used as a long-term trend indicator.
  - **PSAR**: Provides buy or sell signals based on the stock’s trend.
  
### Buy and Sell Logic
- **Buy Signal**: When the stock price is above both EMA-200 and PSAR, and the MACD line crosses above the signal line.
- **Sell Signal**: When the price reaches the target profit or stop loss for each trade.

### Order Execution
- **Limit Orders**: When the quantity is greater than 0, the bot submits a limit order at a specified price.
- **Market Orders**: Executes at the best available market price when conditions are met.

### Logging and Trade Tracking
- Logs each transaction and calculates the profit or loss percentage for each trade.

## 🛠️ Technical Stack

### Core Technologies
- **Node.js**
- **Alpaca API** for stock trading
- **Technical Indicators** library (MACD, EMA, PSAR)
- **dotenv** for environment variable management
- **Lodash** for utility functions

### Key Dependencies
- `@alpacahq/alpaca-trade-api`: Alpaca trading API
- `technicalindicators`: Technical indicators for trading strategies
- `lodash`: Utility library
- `dotenv`: Environment variable management

## 📦 Project Structure

```
AlpacaTradingBot/
├── index.js                 # Main trading bot logic
├── .env                     # Environment variables (API keys)
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

## 🚀 Deployment

### Prerequisites
1. **Alpaca Account** with paper trading API credentials.
2. **Node.js (v14 or higher)** environment.
3. Set up an `.env` file with your **API_KEY** and **SECRET_API_KEY**.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/AlpacaTradingBot.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Alpaca API credentials:
   ```env
   API_KEY=your_api_key_here
   SECRET_API_KEY=your_secret_api_key_here
   ```

4. Start the bot:
   ```bash
   node index.js
   ```

### Configuration
- The stock symbol (`stock`) is set to `AAPL` by default. To change the stock, modify the `stock` variable in `index.js`:
  ```js
  let stock = "AAPL"; // Change to your desired stock symbol
  ```

## 🔧 Technical Notes

- The bot trades 10 stocks per order by default. You can adjust the quantity in the script.
- Real-time data is processed with 1-minute bars (candles).
- The bot operates in a **paper trading** environment to test strategies without real money involved.

## 📊 Performance Metrics

- **Execution Speed**: Instant market data processing
- **Order Handling**: Real-time market orders and limit orders
- **Cost Optimization**: Paper trading environment for risk-free testing

## 🔒 Security

- **API Key Management**: Secure handling of API keys through environment variables
- **No real money** is used in paper trading

## 💰 Cost Optimization

- No real trading costs, as the bot operates in paper trading mode.
- Alpaca's API is free for paper trading accounts.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Project Link: [https://github.com/your-repository/AlpacaTradingBot](https://github.com/your-repository/AlpacaTradingBot)
