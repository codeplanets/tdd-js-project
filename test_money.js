import * as assert from 'assert';
import { Money } from './money.js';
import { Portfolio } from './portfolio.js';


class MoneyTest {
    testMultiplication() {
        let tenEuros = new Money(10, "EUR");
        let twentyEuros = new Money(20, "EUR");
        
        assert.deepStrictEqual(tenEuros.times(2), twentyEuros);
    }
    
    testDivision() {
        let originalMoney = new Money(4002, "KRW");
        let actualMoneyAfterDivision = originalMoney.divide(4);
        let expectedMoneyAfterDivision = new Money(1000.5, "KRW");
        
        assert.deepStrictEqual(actualMoneyAfterDivision, expectedMoneyAfterDivision);
    }
    
    testAddition() {
        let fiveDollars = new Money(5, "USD");
        let tenDollars = new Money(10, "USD");
        let fifteenDollars = new Money(15, "USD");
        let portfolio = new Portfolio();
        
        portfolio.add(fiveDollars, tenDollars);
        assert.deepStrictEqual(portfolio.evaluate("USD"), fifteenDollars);
    }
    
    runAllTests() {
        this.testMultiplication();
        this.testDivision();
        this.testAddition();
    }
}

console.log('Running tests...');

new MoneyTest().runAllTests();

console.log('All tests passed!');
