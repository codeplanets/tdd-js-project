import { Money } from './money.js';

export class Portfolio {
    constructor() {
        this.money = [];
    }

    add(...money) {
        this.money = this.money.concat(money);
    }
    
    evaluate(bank, currency) {
        let failures = [];
        let total = this.money.reduce( (sum, money) => {
            try {
                let convertedMoney = bank.convert(money, currency);
                return sum + convertedMoney.amount;
            }
            catch (e) {
                failures.push(e.message);
                return sum;
            }
        }, 0);

        if (!failures.length) {
            return new Money(total, currency);
        }
        throw new Error("Missing exchange rate(s):[" + failures.join(", ") + "]");
    }
}