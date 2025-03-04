import { Money } from './money.js';

export class Portfolio {
    constructor() {
        this.money = [];
    }

    add(...money) {
        this.money = this.money.concat(money);
    }
    
    evaluate(currency) {
        let failures = [];
        let total = this.money.reduce( (sum, money) => {
            let convertedAmount = this.convert(money, currency);
            if (convertedAmount === undefined) {
                failures.push(money.currency + "->" + currency);
                return sum;
            }
            return sum + convertedAmount;
        }, 0);
        if (!failures.length) {
            return new Money(total, currency);
        }
        throw new Error("Missing exchange rate(s):[" + failures.join(", ") + "]");
    }
    
    convert(money, currency) {
        let exchangeRates = new Map();
        exchangeRates.set("EUR->USD", 1.2);
        exchangeRates.set("USD->KRW", 1100);
        if (money.currency == currency) {
            return money.amount;
        }
        let key = money.currency + "->" + currency;
        let rate = exchangeRates.get(key);
        if (rate === undefined) {
            return undefined;
        }
        return money.amount * rate;
    }
}