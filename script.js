// var requestURL = 'https://api.exchangerate.host/latest?base=USD&symbols=RUB';
// var request = new XMLHttpRequest();
// request.open('GET', requestURL);
// request.responseType = 'json';
// request.send();

// request.onload = function () {
//     var response = request.response;
//     console.log(response);
// }



// const getExchangeRate = () => {
//     return new Promise((resolve,reject)=>{

//     });
// } 

// fetch('https://api.exchangerate.host/latest?base=USD&symbols=RUB').then(response => response.json()).then(data => {
//     console.log(data);
// }).catch(() => {
//     alert('Connection problems');
// });

var input = document.querySelectorAll('.input-number');

const getExchangeRate = async () => {
    const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=RUB&amount=500');
    const data = await response.json();
    return data;
}

// getExchangeRate().then(data=>{
//     console.log(data);
// });

document.addEventListener('keypress', (e) => {
    let regex = new RegExp("^[0-9]");
    let key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    // e.target.value.replace(',','.');
    if (!regex.test(key)) {
        e.preventDefault();
        console.log(1)
    }
});

// $('input').on('keypress', function (event) {
//     var regex = new RegExp("^[a-zA-Z0-9]+$");
//     var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
//     if (!regex.test(key)) {
//        event.preventDefault();
//        return false;
//     }
// });

// input.forEach(item=>{
//     item.addEventListener('change',(e)=>{
//         console.log(e.target.value);
//     });
// });