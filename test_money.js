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

    testAdditionOfDollarsAndEuros() {
        let fiveDollars = new Money(5, "USD");
        let tenEuros = new Money(10, "EUR");
        let portfolio = new Portfolio();
        portfolio.add(fiveDollars, tenEuros);
        let expectedValue = new Money(17, "USD");
        assert.deepStrictEqual(portfolio.evaluate("USD"), expectedValue);
    }

    testAdditionOfDollarsAndWons() {
        let oneDollar = new Money(1, "USD");
        let elevenHundredWon = new Money(1100, "KRW");
        let portfolio = new Portfolio();
        portfolio.add(oneDollar, elevenHundredWon);
        let expectedValue = new Money(2200, "KRW");
        assert.deepStrictEqual(portfolio.evaluate("KRW"), expectedValue);
    }

    testAdditionWithMultipleMissingExchangeRates() {
        let oneDollar = new Money(1, "USD");
        let oneEuro = new Money(1, "EUR");
        let oneWon = new Money(1, "KRW");
        let portfolio = new Portfolio();
        portfolio.add(oneDollar, oneEuro, oneWon);
        let expectedError = new Error(
            "Missing exchange rate(s):[USD->Kalganid, EUR->Kalganid, KRW->Kalganid]");
        assert.throws( () => {
            portfolio.evaluate("Kalganid");
        }, expectedError);
    }
    
    getAllTestMethods() {
        return Object.getOwnPropertyNames(MoneyTest.prototype).filter( (prop) => {
            return typeof MoneyTest.prototype[prop] == 'function' && prop.startsWith('test');
        });
    }

    runAllTests() {
        this.getAllTestMethods().forEach( (testMethod) => {
            console.log(`Running test: ${testMethod}`);
            let method = Reflect.get(this, testMethod);
            try {
                Reflect.apply(method, this, []);
            } catch (e) {
                if (e instanceof assert.AssertionError) {
                    console.error(e);
                } else {
                    throw e;
                }
            }
        });
    }
}

new MoneyTest().runAllTests();
