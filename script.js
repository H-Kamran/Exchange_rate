var input = document.querySelectorAll('.input-number');
var currency_lists = document.querySelectorAll('.currency-list');
var exchangeRatesP = document.querySelectorAll('.exchange-rate');
var base = 'RUB';
var symbol = 'USD';
var amount = 1;

const getExchangeRate = async (base, symbol, amount) => {
    amount = Number(amount.toString().split(',').join('.'));
    const response = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbol}&amount=${amount}`);
    const data = await response.json();
    return data;
}

function writeCurrencyRelations() {
    exchangeRatesP[0].textContent = `${input[0].value} ${base} = ${input[1].value} ${symbol}`;
    exchangeRatesP[1].textContent = `${input[1].value} ${symbol} = ${input[0].value} ${base}`;
}

function getExchangeRateFunc(forward, amount) {
    if (base === symbol) {
        if (forward) {
            input[1].value = input[0].value;
        } else {
            input[0].value = input[1].value;
        }
        writeCurrencyRelations();
    } else {
        if (forward) {
            if (input[0].value == 0) {
                input[1].value = 0;
                writeCurrencyRelations();
            } else {
                getExchangeRate(base, symbol, amount).then(data => {
                    input[1].value = data.rates[`${symbol}`];
                    writeCurrencyRelations();
                }).catch((e) => {
                    alert('Internet Disconnected');
                });
            }
        } else {
            if (input[1].value == 0) {
                input[0].value = 0;
                writeCurrencyRelations();
            } else {
                getExchangeRate(symbol, base, amount).then(data => {
                    input[0].value = data.rates[`${base}`];
                    writeCurrencyRelations();
                }).catch(() => {
                    alert('Internet Disconnected');
                });
            }
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
    // e.target.value.replace('[,]','.');
    let key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!regex.test(key)) {
        e.preventDefault();
    }
});

input.forEach((item, index) => {
    function changeEnterEvent() {
        if (index == 0) {
            amount = item.value;
        }
        if (index == 0) {
            getExchangeRateFunc(true, item.value);
        } else {
            getExchangeRateFunc(false, item.value);
        }
    }
    item.addEventListener('change', changeEnterEvent);
    item.addEventListener('keypress', (e) => {
        if (e.code == "Enter") {
            changeEnterEvent();
        }
    });
});

currency_lists.forEach((ul, index) => {
    ul = ul.children;
    for (let i = 0; i < ul.length; i++) {
        ul[i].addEventListener('click', (e) => {
            if (index == 0) {
                base = e.target.id;
            }
            else {
                symbol = e.target.id;
            }
            getExchangeRateFunc(true, amount);
            changeColor(base, symbol);
        });
    }
});

function changeColor(base, symbol) {
    currency_lists.forEach((ul, index) => {
        ul = ul.children;
        for (let i = 0; i < ul.length; i++) {
            if (index == 0) {
                ul[i].style.backgroundColor = null;
                ul[i].style.color = '#C6C6C6';
                if (ul[i].id == base) {
                    ul[i].style.backgroundColor = "#833AE0";
                    ul[i].style.color = "#FFFFFF"
                }
            }
            else {
                ul[i].style.backgroundColor = null;
                ul[i].style.color = '#C6C6C6';
                if (ul[i].id == symbol) {
                    ul[i].style.backgroundColor = "#833AE0";
                    ul[i].style.color = "#FFFFFF"
                }
            }
        }
    });
}
