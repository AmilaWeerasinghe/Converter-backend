const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

//create the express server
const app = express();

//enable cors and body-parser in the express server
app.use(cors());
app.use(bodyParser.json());

const convert = async (date,sourceCurrency,targetCurrency) => {
    console.log('convert function',date,targetCurrency)
    const appId = '2260abce90d0403fb5aab8ce96fee044';
    const base_url = `https://openexchangerates.org/api/historical/${date}.json`;
    const params = { app_id: appId,
    base:sourceCurrency,
    symbols: targetCurrency };

    try {
        
        const response = await axios.get(base_url,{
            params
        })
        console.log(response.data);
        return response.data.rates;
    } catch(e) {
        console.log("error in fetching data from openexchange",e.response.data)
    }
}

//rest endpoint
app.post('/api/convert', async (req, res)=> {
    console.log('http post rest end point',req.body);
    try {
        const {date,amountInSourceCurrency,sourceCurrency, targetCurrency} = req.body;
    const convertedRate = await convert(date,sourceCurrency,targetCurrency);
    const rateValue = convertedRate[targetCurrency];
    console.log("rate value",rateValue);
    console.log("amountInSourceCurrency",parseFloat(amountInSourceCurrency)); 
    const amount =  parseFloat(amountInSourceCurrency);

    const convertedAmount  = amountInSourceCurrency * rateValue;
    console.log("final amoutn",convertedAmount);
    res.json(convertedAmount);
    } catch (e) {
        console.log("error in the calculating the values",e);
        res.status(500).json("error in the calculating the values",e);
    }
    

});

//listen to a port using server
const port = 5002; // for now

app.listen(port, ()=>{
    console.log("server is runnig on port",port);
});