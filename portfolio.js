const Money = require('./money');

class Portfolio {
    constructor() {
        this.money = [];
    }

    add(...money) {
        this.money = this.money.concat(money);
    }
    
    evaluate(currency) {
        let total = this.money.reduce( (sum, money) => {
            return sum + money.amount;
        }, 0);
        return new Money(total, currency);
    }
}

module.exports = Portfolio;