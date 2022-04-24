var input = document.querySelectorAll('.input-number');
var currency_lists = document.querySelectorAll('.currency-list');
var exchangeRatesP = document.querySelectorAll('.exchange-rate');
var base = 'RUB';
var symbol = 'USD';
var amount = 1;

const getExchangeRate = async (base, symbol, amount) => {
    // amount = Number(amount.toString().split(',').join('.'));
    const response = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${symbol}&amount=${amount}`);
    const data = await response.json();
    return data;
}

function writeCurrencyRelations() {
    getExchangeRate(base, symbol, 1).then(data => {
        exchangeRatesP[0].textContent = `1 ${base} = ${data.rates[`${symbol}`]} ${symbol}`;
    });
    getExchangeRate(symbol, base, 1).then(data => {
        exchangeRatesP[1].textContent = `1 ${symbol} = ${data.rates[`${base}`]} ${base}`;
    });
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

document.addEventListener('keypress', (e) => {
    let regex = new RegExp("^[0-9]|[.]|[,]");
    // let key = String.fromCharCode(!e.charCode ? e.which : e.charCode);

    // If there is another symbol that is not defined in regexp, we deprecate
    if (!regex.test(e.key)) {
        e.preventDefault();
    }
    else {
        // if there is more than one dot, we deprecate
        if (e.target.value.includes('.') && (e.key === ',' || e.key === '.')) {
            e.preventDefault();
        }
        // Converting comma to dot
        else if(e.key === ','){
            let start = e.target.selectionStart;
            let end = e.target.selectionEnd;
            let oldValue = e.target.value;

            e.target.value = oldValue.slice(0, start) + '.' + oldValue.slice(end);
            e.target.selectionStart = e.target.selectionEnd = start + 1;
            
            e.preventDefault();
        }
    }
});

input.forEach((item, index) => {
    item.addEventListener('change', changeEnterEvent);
    item.addEventListener('keypress', (e) => {
        if (e.code == "Enter") {
            changeEnterEvent();
        }
    });
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

// Default
getExchangeRateFunc(true, amount);
changeColor(base, symbol)