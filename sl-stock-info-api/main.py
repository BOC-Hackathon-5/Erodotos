import yfinance as yf
from fastapi import FastAPI
import os
import json

app = FastAPI()

@app.get("/api/info/{tickerSymbol}")
def get_enterprice_profile(tickerSymbol: str):

    enterprice = yf.Ticker(tickerSymbol)
    full_info = enterprice.info

    short_info = {
        "longName": full_info["longName"],
        "longBusinessSummary": full_info["longBusinessSummary"],
        "country": full_info["country"],
        "sector": full_info["sector"],
        "industry": full_info["industry"],
        "symbol": full_info["symbol"],
        "website": full_info["website"],
        "exchange": full_info["exchange"],
        "currency": full_info["currency"],
        "currentPrice": full_info["currentPrice"],
        "marketCap": full_info["marketCap"],
        "recommendationKey": full_info["recommendationKey"],
    }

    return {"data": short_info , "error": None}
