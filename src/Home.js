import React from 'react';
import Chart from 'chart.js';
import { json, checkStatus } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAltH, faMoneyBillAlt, faCalculator } from '@fortawesome/free-solid-svg-icons';

class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseAmount: 1.00,
      foreignAmount: 0.00,
      baseCurrency: 'HKD',
      baseCurrencyForList: 'HKD',
      foreignCurrency: 'USD',
      foreignCurrencyList: [],
      error: '',
      convertButton: 'Convert'
    };

    this.chartRef = React.createRef();
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleBaseCurrencyChange = this.handleBaseCurrencyChange.bind(this);
    this.handleBaseCurrencyForListChange = this.handleBaseCurrencyForListChange.bind(this);
    this.handleForeignCurrencyChange = this.handleForeignCurrencyChange.bind(this);
    this.handleConvert = this.handleConvert.bind(this);
    this.handleCurrencySwap = this.handleCurrencySwap.bind(this);
    this.handleExchangeRateList = this.handleExchangeRateList.bind(this);
  }

  componentDidMount () {
    this.handleExchangeRateList();
  }

  handleExchangeRateList() {
    const { baseCurrencyForList } = this.state;
    fetch(`https://alt-exchange-rate.herokuapp.com/latest?base=${baseCurrencyForList}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (!data) {
          throw new Error(data.error);
        }
        if (data) {
          let obj = data.rates;
          let list = Object.keys(obj).map((key) => [key, obj[key]]);
          this.setState({ foreignCurrencyList: [...list] });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  handleAmountChange(event) {
    this.setState({ baseAmount: event.target.value, foreignAmount: 0.00 });
  }

  handleBaseCurrencyChange(event) {
    this.setState({ baseCurrency: event.target.value, foreignAmount: 0.00 });
  }

  handleBaseCurrencyForListChange(event) {
    this.setState({ baseCurrencyForList: event.target.value, foreignCurrencyList: [] }, () => this.handleExchangeRateList());
  }

  handleForeignCurrencyChange(event) {
    this.setState({ foreignCurrency: event.target.value, foreignAmount: 0.00 });
  }

  handleCurrencySwap(event) {
    const { baseCurrency, foreignCurrency } = this.state;
    const originalBaseCurrency = baseCurrency;
    const originalForeignCurrency = foreignCurrency;
    this.setState({ baseCurrency: originalForeignCurrency, foreignCurrency: originalBaseCurrency, foreignAmount: 0.00 });
  }

  handleConvert(event) {
    event.preventDefault();
    const { baseAmount, baseCurrency, foreignCurrency } = this.state;
    this.setState({ convertButton: 'loading ...' });
    fetch(`https://alt-exchange-rate.herokuapp.com/latest?base=${baseCurrency}&symbols=${foreignCurrency}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (!data) {
          throw new Error(data.error);
        }
        if (data) {
          this.setState({ foreignAmount: Math.round((baseAmount * data.rates[foreignCurrency] + Number.EPSILON) * 100) / 100 });
        }
        this.setState({ convertButton: 'Convert' });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
    this.getHistoricalRates(this.state.baseCurrency, this.state.foreignCurrency);
  }

  getHistoricalRates = (baseCurrency, foreignCurrency) => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date((new Date()).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    fetch(`https://alt-exchange-rate.herokuapp.com/history?start_at=${startDate}&end_at=${endDate}&base=${baseCurrency}&symbols=${foreignCurrency}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        console.log(data);
        const chartLabels = Object.keys(data.rates);
        const chartData = Object.values(data.rates).map(rate => rate[foreignCurrency]);
        const chartLabel = `${baseCurrency}/${foreignCurrency}`;
        this.buildChart(chartLabels, chartData, chartLabel);
      })
      .catch(error => console.error(error.message));
  }

  buildChart = (labels, data, label) => {
    console.log(this.chartRef);
    const chartRef = this.chartRef.current.getContext("2d");
    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }
    console.log("buildchart");
    this.chart = new Chart(chartRef, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
      }
    });
    console.log("buildchart2");
  }

  render() {
    const { baseAmount, foreignAmount, baseCurrency, baseCurrencyForList, foreignCurrency, foreignCurrencyList, error, convertButton } = this.state;

    return (
      <div className="container my-4">
        <h3 className="pageTop">Currency Converter <FontAwesomeIcon icon={faCalculator} /></h3>
        <div className="form-row mt-4">
          <div className="form-group col-md-3">
            <label for="inputCity">Amount</label>
            <input type="text" className="form-control" id="inputAmount" value={baseAmount} onChange={this.handleAmountChange}></input>
          </div>
          <div className="form-group col-md-4">
            <label for="inputBaseCurrency">Base Currency</label>
            <select id="inputBaseCurrency" className="form-control" value={baseCurrency} onChange={this.handleBaseCurrencyChange}>
              <option selected>HKD</option>
              <option>AUD</option>
              <option>BGN</option>
              <option>BRL</option>
              <option>CAD</option>
              <option>CHF</option>
              <option>CNY</option>
              <option>CZK</option>
              <option>DKK</option>
              <option>GBP</option>
              <option>GBP</option>
              <option>HRK</option>
              <option>HUF</option>
              <option>IDR</option>
              <option>ILS</option>
              <option>INR</option>
              <option>ISK</option>
              <option>JPY</option>
              <option>KRW</option>
              <option>MXN</option>
              <option>MYR</option>
              <option>NOK</option>
              <option>NZD</option>
              <option>PHP</option>
              <option>PLN</option>
              <option>RON</option>
              <option>RUB</option>
              <option>SEK</option>
              <option>SGD</option>
              <option>THB</option>
              <option>TRY</option>
              <option>USD</option>
              <option>ZAR</option>
            </select>
          </div>
          <div className="form-group col-md-1 mt-3 h3 text-secondary">
            <FontAwesomeIcon icon={faArrowsAltH} onClick={this.handleCurrencySwap} />
          </div>
          <div className="form-group col-md-4">
            <label for="inputForeignCurrency">Foreign Currency</label>
            <select id="inputForeignCurrency" className="form-control" value={foreignCurrency} onChange={this.handleForeignCurrencyChange}>
              <option selected>USD</option>
              <option>AUD</option>
              <option>BGN</option>
              <option>BRL</option>
              <option>CAD</option>
              <option>CHF</option>
              <option>CNY</option>
              <option>CZK</option>
              <option>DKK</option>
              <option>GBP</option>
              <option>GBP</option>
              <option>HRK</option>
              <option>HKD</option>
              <option>HUF</option>
              <option>IDR</option>
              <option>ILS</option>
              <option>INR</option>
              <option>ISK</option>
              <option>JPY</option>
              <option>KRW</option>
              <option>MXN</option>
              <option>MYR</option>
              <option>NOK</option>
              <option>NZD</option>
              <option>PHP</option>
              <option>PLN</option>
              <option>RON</option>
              <option>RUB</option>
              <option>SEK</option>
              <option>SGD</option>
              <option>THB</option>
              <option>TRY</option>
              <option>ZAR</option>
            </select>
          </div>
        </div>
        <div>
          <button type="button" className="btn btn-secondary" onClick={this.handleConvert}>{convertButton}</button>
        </div>
        {(() => {
          if (error) {
            return error;
          }
          if (foreignAmount) {
            return (
              <div className="mt-4 h1 text-dark">
                {baseAmount} {baseCurrency} = {foreignAmount} {foreignCurrency}
              </div>
            );
          }
        })()}
        <hr className="my-5" />
        <canvas ref={this.charfRef} />
        <hr className="my-5" />
        <h3 className="my-2">Exchange Rate List <FontAwesomeIcon icon={faMoneyBillAlt} /></h3>
        <div className="form-row my-4">
          <div className="col-md-3"></div>
          <label for="inputBaseCurrencyForList" className="col-md-3 col-form-label">Base 1 $</label>
          <div className="col-md-3">
            <select id="inputBaseCurrencyForList" className="form-control" value={baseCurrencyForList} onChange={this.handleBaseCurrencyForListChange}>
              <option selected>HKD</option>
              <option>AUD</option>
              <option>BGN</option>
              <option>BRL</option>
              <option>CAD</option>
              <option>CHF</option>
              <option>CNY</option>
              <option>CZK</option>
              <option>DKK</option>
              <option>GBP</option>
              <option>GBP</option>
              <option>HRK</option>
              <option>HUF</option>
              <option>IDR</option>
              <option>ILS</option>
              <option>INR</option>
              <option>ISK</option>
              <option>JPY</option>
              <option>KRW</option>
              <option>MXN</option>
              <option>MYR</option>
              <option>NOK</option>
              <option>NZD</option>
              <option>PHP</option>
              <option>PLN</option>
              <option>RON</option>
              <option>RUB</option>
              <option>SEK</option>
              <option>SGD</option>
              <option>THB</option>
              <option>TRY</option>
              <option>USD</option>
              <option>ZAR</option>
            </select>
          </div>
          <div className="col-md-3"></div>
        </div>
        {(() => {
          if (error) {
            return error;
          }
          if (foreignCurrencyList.length === 0) {
            return (
              <div className="currencyExchangeList my-4 h4">
                loading ...
              </div>
            );
          }
          if (foreignCurrencyList) {
            let foreignCurrencyListElements = foreignCurrencyList.filter(currency => currency[0] !== baseCurrencyForList).map(currency => <div className="form-row"><div className="col-md-3"></div><div className="col-md-3 text-left">{currency[0]}</div><div className="col-md-3 text-right">{Math.round((currency[1] + Number.EPSILON) * 10000) / 10000}</div><div className="col-md-3"></div></div>);
            return (
              <div className="currencyExchangeList h4">
                {foreignCurrencyListElements}
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

export default CurrencyConverter;
