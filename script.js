var input = document.querySelectorAll('.input-number');
var currency_lists = document.querySelectorAll('.currency-list');
var exchangeRatesP = document.querySelectorAll('.exchange-rate');
var base = 'RUB';
var symbol = 'USD';
var amount = 1;

const getExchangeRate = async (base, symbol, amount) => {
    const response = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbol}&amount=${amount}`);
    const data = await response.json();
    return data;
}

function getExchangeRateFunc(forward, amount) {
    if (base === symbol) {
        if (forward) {
            input[1].value = input[0].value;
        } else {
            input[0].value = input[1].value;
        }
    } else {

        if (forward) {
            getExchangeRate(base, symbol, amount).then(data => {
                input[1].value = data.rates[`${symbol}`];
                exchangeRatesP[0].textContent = `${input[0].value} ${base} = ${input[1].value} ${symbol}`;
                exchangeRatesP[1].textContent = `${input[1].value} ${symbol} = ${input[0].value} ${base}`;
            }).catch(() => {
                alert('Internet Disconnected');
            });
        } else {
            getExchangeRate(symbol, base, amount).then(data => {
                input[0].value = data.rates[`${base}`];
                exchangeRatesP[0].textContent = `${input[0].value} ${base} = ${input[1].value} ${symbol}`;
                exchangeRatesP[1].textContent = `${input[1].value} ${symbol} = ${input[0].value} ${base}`;
            }).catch(() => {
                alert('Internet Disconnected');
            });
        }
    }
}

// Default
getExchangeRateFunc(true, amount);
currency_lists[0].firstElementChild.style.backgroundColor = "#833AE0";
currency_lists[0].firstElementChild.style.color = "#FFFFFF";
currency_lists[1].firstElementChild.nextElementSibling.style.backgroundColor = "#833AE0";
currency_lists[1].firstElementChild.nextElementSibling.style.color = "#FFFFFF";

document.addEventListener('keypress', (e) => {
    let regex = new RegExp("^[0-9]|[.]|[,]");
    let key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    // e.target.value.replace(',','.');
    if (!regex.test(key)) {
        e.preventDefault();
    }
});

input.forEach((item, index) => {
    function changeAndEnter() {
        if (index == 0) {
            getExchangeRateFunc(true, item.value);
        } else {
            getExchangeRateFunc(false, item.value);
        }
    }
    item.addEventListener('change', changeAndEnter);
    item.addEventListener('keypress', (e) => {
        if (e.code == "Enter") {
            changeAndEnter();
        }
    });
});

currency_lists.forEach((ul, index) => {
    ul = ul.childNodes;
    ul.forEach((child, i) => {
        if (i % 2 != 0) {
            child.addEventListener('click', () => {
                if (index == 0) {
                    base = child.textContent;
                }
                else {
                    symbol = child.textContent;
                }
                getExchangeRateFunc(true, amount);
                changeColor(base, symbol);
            });
        }
    });
});

function changeColor(base, symbol) {
    currency_lists.forEach((ul, index) => {
        // ul=ul.children;
        // console.log(ul=ul.children)
        ul = ul.childNodes;
        // console.log(ul)
        ul.forEach((item, i) => {
            if (i % 2 != 0) {
                if (index == 0) {
                    item.style.backgroundColor = null;
                    item.style.color = '#C6C6C6';
                    if (item.textContent == base) {
                        item.style.backgroundColor = "#833AE0";
                        item.style.color = "#FFFFFF"
                    }
                } else {
                    item.style.backgroundColor = null;
                    item.style.color = '#C6C6C6';
                    if (item.textContent == symbol) {
                        item.style.backgroundColor = "#833AE0";
                        item.style.color = "#FFFFFF"
                    }
                }
            }
        });
    });
}
