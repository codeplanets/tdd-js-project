import * as assert from 'assert';
import { Money } from './money.js';
import { Portfolio } from './portfolio.js';
import { Bank } from './bank.js';

class MoneyTest {
    setUp() {
        this.bank = new Bank();
        this.bank.addExchangeRate("EUR", "USD", 1.2);
        this.bank.addExchangeRate("USD", "KRW", 1100);
    }

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
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "USD"), fifteenDollars);
    }

    testAdditionOfDollarsAndEuros() {
        let fiveDollars = new Money(5, "USD");
        let tenEuros = new Money(10, "EUR");
        let portfolio = new Portfolio();
        portfolio.add(fiveDollars, tenEuros);
        let expectedValue = new Money(17, "USD");
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "USD"), expectedValue);
    }

    testAdditionOfDollarsAndWons() {
        let oneDollar = new Money(1, "USD");
        let elevenHundredWon = new Money(1100, "KRW");
        let portfolio = new Portfolio();
        portfolio.add(oneDollar, elevenHundredWon);
        let expectedValue = new Money(2200, "KRW");
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "KRW"), expectedValue);
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
            portfolio.evaluate(this.bank, "Kalganid");
        }, expectedError);
    }

    testConversionWithDifferentRatesBetweenTwoCurrencies() {
        let tenEuros = new Money(10, "EUR");
        assert.deepStrictEqual(this.bank.convert(tenEuros, "USD"), new Money(12, "USD"));
        
        this.bank.addExchangeRate("EUR", "USD", 1.3);
        assert.deepStrictEqual(this.bank.convert(tenEuros, "USD"), new Money(13, "USD"));
    }

    testConversionWithMissingExchangeRate() {
        let tenEuros = new Money(10, "EUR");
        let expectedError = new Error("EUR->Kalganid");
        assert.throws( () => {
            this.bank.convert(tenEuros, "Kalganid");
        }, expectedError);
    }
    
    getAllTestMethods() {
        return Object.getOwnPropertyNames(MoneyTest.prototype).filter( (prop) => {
            return typeof MoneyTest.prototype[prop] == 'function' && prop.startsWith('test');
        });
    }

    randomizeTestOrder(testMethod) {
        for (let i = testMethod.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [testMethod[i], testMethod[j]] = [testMethod[j], testMethod[i]];
        }
        return testMethod;
    }

    runAllTests() {
        let testMethods = this.randomizeTestOrder(this.getAllTestMethods());
        testMethods.forEach( (testMethod) => {
            console.log(`Running test: ${testMethod}`);
            let method = Reflect.get(this, testMethod);
            try {
                this.setUp();
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
