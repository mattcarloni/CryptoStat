function userLogOut() {
  localStorage.clear();
}

var url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=Eur&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1m";
const user_crypto = [];
var cryptoList = [];
(function startWebsite() {
  $.ajax({
    url,
    method: "GET",
    dataType: "json",
    success: function (data) {
      cryptoList = data;
      take_data_db_coins();
    },
  });
})();

/* funzione che prende gli item dal db e dopo averlo fatto stampa la pagina del wallet*/
function take_data_db_coins() {
  (async function () {
    let response = await fetch("/get-data");
    let records = await response.json();
    if (response.status === 200) {
      records.forEach((doc) => {
        user_crypto.push({
          id: doc._id,
          name: doc.name,
          quantity: doc.quantity,
          purchase_price: doc.purchase_price,
          dob: doc.dob,
        });
      });
    } else console.log("something went wrong");

    print_owned_cryptos();
  })();
}

function print_owned_cryptos() {
  // scrittura del nome nella siderbar
  name_element = localStorage.getItem("name");
  document.getElementById("username").innerHTML = `${name_element}`;
  var total_buy = 0;
  var wallet_value = 0;
  var total_earn = 0;
  // setto gli headers della tabella
  let body = document.getElementById("crypto_body");
  body.innerHTML = "";
  //ciclo for che itera all'interno del db
  for (let i = 0; i < user_crypto.length; i++) {
    for (let c = 0; c < cryptoList.length; c++) {
      // confronto per trovare i valori corretti nell'api, che corrispondono a quelli presenti nel database
      if (cryptoList[c].name == user_crypto[i].name) {
        // setto il colore della scritta balance
        let value_balance_color = "green";
        if (
          user_crypto[i].quantity * cryptoList[c].current_price -
            user_crypto[i].purchase_price <
          0
        ) {
          value_balance_color = "red";
        }
        // calcoli finanziari svolti ad ogni ciclo
        let actual_value =
          parseFloat(user_crypto[i].quantity) *
          parseFloat(cryptoList[c].current_price);
        let balance =
          parseFloat(user_crypto[i].quantity) *
            parseFloat(cryptoList[c].current_price) -
          parseFloat(user_crypto[i].purchase_price);
        // aggiunta del parametro rateo all'oggetto
        user_crypto[i].rateo = balance;
        total_buy = total_buy + parseFloat(user_crypto[i].purchase_price);
        wallet_value = wallet_value + actual_value;
        total_earn = total_earn + balance;
        /*stampa degli elemtni presenti nel databse*/
        let crypto_info_row = document.createElement("div");
        crypto_info_row.setAttribute("class", "crypto_row");
        crypto_info_row.innerHTML = `<div class="crypto_img_box"> <img src="${
          cryptoList[c].image
        }" class="crypto_img"> </div>
                                        <div class="crypto_symbol"> ${cryptoList[
                                          c
                                        ].symbol.toUpperCase()} </div>
                                        <div class="crypto_qtty"> ${
                                          user_crypto[i].quantity
                                        } </div>
                                        <div class="crypto_cell"> ${parseFloat(
                                          user_crypto[i].purchase_price
                                        ).toLocaleString("it-IT", {
                                          style: "currency",
                                          currency: "EUR",
                                          maximumFractionDigits: 0,
                                          minimumFractionDigits: 0,
                                        })} </div>
                                        <div class="crypto_cell" > ${actual_value.toLocaleString(
                                          "it-IT",
                                          {
                                            style: "currency",
                                            currency: "EUR",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                          }
                                        )} </div>
                                        <div class="crypto_cell" style = "color : ${value_balance_color}"> ${balance.toLocaleString(
          "it-IT",
          {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }
        )} </div>      
                                        <div class="crypto_cell"> ${
                                          user_crypto[i].dob
                                        } </div>`;
        body.appendChild(crypto_info_row);
      }
    }
  }
  // stampa di tutti i risultati finanziari
  let total_buy_text = document.getElementById("total_buy");
  total_buy_text.innerHTML = `<span> Invested :</span> <span> <b> ${total_buy.toLocaleString(
    "it-IT",
    { style: "currency", currency: "EUR" }
  )} </b> </span>`;
  let total_wallet_text = document.getElementById("total_wallet");
  total_wallet_text.innerHTML = `<span> Wallet :</span> <span>  <b> ${wallet_value.toLocaleString(
    "it-IT",
    { style: "currency", currency: "EUR" }
  )} </b> </span>`;
  let total_earn_text = document.getElementById("total_earn");
  total_earn_text.innerHTML = ` <span> Gain/Loss : </span> <span>  <b> ${total_earn.toLocaleString(
    "it-IT",
    { style: "currency", currency: "EUR" }
  )} </b> </span>`;
}

function print_owned_cryptos_by_name(selected_crypto) {
  var total_buy = 0;
  var wallet_value = 0;
  var total_sales = 0;
  let container = document.getElementById("crypto_container");
  let body = document.getElementById("crypto_body");
  body.innerHTML = "";
  for (let i = 0; i < user_crypto.length; i++) {
    for (let c = 0; c < cryptoList.length; c++) {
      if (
        cryptoList[c].name == user_crypto[i].name &&
        user_crypto[i].name == selected_crypto
      ) {
        // setto il colore della scritta balance
        let value_balance_color = "green";
        if (
          user_crypto[i].quantity * cryptoList[c].current_price -
            user_crypto[i].purchase_price <
          0
        ) {
          value_balance_color = "red";
        }
        // calcoli finanziari svolti ad ogni ciclo
        let actual_value =
          parseFloat(user_crypto[i].quantity) *
          parseFloat(cryptoList[c].current_price);
        let balance =
          parseFloat(user_crypto[i].quantity) *
            parseFloat(cryptoList[c].current_price) -
          parseFloat(user_crypto[i].purchase_price);
        total_buy = total_buy + parseFloat(user_crypto[i].purchase_price);
        wallet_value = wallet_value + actual_value;
        let crypto_info_row = document.createElement("div");
        crypto_info_row.setAttribute("class", "crypto_row");
        crypto_info_row.innerHTML = `<div class="crypto_img_box"> <img src="${
          cryptoList[c].image
        }" class="crypto_img"> </div> 
                                        <div class="crypto_symbol"> ${cryptoList[
                                          c
                                        ].symbol.toUpperCase()} </div>
                                        <div class="crypto_qtty"> ${
                                          user_crypto[i].quantity
                                        } </div>
                                        <div class="crypto_cell"> ${parseFloat(
                                          user_crypto[i].purchase_price
                                        ).toLocaleString("it-IT", {
                                          style: "currency",
                                          currency: "EUR",
                                          maximumFractionDigits: 0,
                                          minimumFractionDigits: 0,
                                        })} </div>
                                        <div class="crypto_cell" > ${actual_value.toLocaleString(
                                          "it-IT",
                                          {
                                            style: "currency",
                                            currency: "EUR",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0,
                                          }
                                        )} </div>
                                        <div class="crypto_cell" style = "color : ${value_balance_color}"> ${balance.toLocaleString(
          "it-IT",
          {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }
        )} </div>      
                                        <div class="crypto_cell"> ${
                                          user_crypto[i].dob
                                        } </div>`;
        body.appendChild(crypto_info_row);
      }
    }
  }
}

// listener che ascolta ul click del filtro
$(document).ready(function () {
  $("#filter").click(function () {
    $("select").toggle(500);
    create_option();
  });
});

// funzione che crea la box dove selezionare la filtro per fare il filtro della tabella
function create_option() {
  let crypto_selector_list_pre = [];
  let crypto_selector_list = [];
  let crypto_selector_item = document.createElement("option");
  crypto_selector_item.innerHTML = "All";
  crypto_selector_item.setAttribute("value", "");
  crypto_selector_list.push(crypto_selector_item);
  user_crypto.forEach((item) => {
    // evito di creare doppioni nella scelta dei nomi
    if (crypto_selector_list_pre.includes(item.name)) {
    } else {
      crypto_selector_list_pre.push(item.name);
      let crypto_selector_item = document.createElement("option");
      crypto_selector_item.setAttribute("value", item.name);
      crypto_selector_item.innerHTML = item.name;
      crypto_selector_list.push(crypto_selector_item);
    }
  });
  document
    .querySelector("#select_crypto")
    .replaceChildren(...crypto_selector_list);
}

function sort_crypto_by_name(selected_crypto) {
  selected_crypto = localStorage.getItem("selected_crypto");
  console.log(selected_crypto);
  // se la selezione ricade sul campo vuoto allora...
  if (selected_crypto == "") {
    print_owned_cryptos();
  }
  //senno...
  else {
    print_owned_cryptos_by_name(selected_crypto);
  }
}

// listener sul change del filtro crypto
let filter_by_name = document.getElementById("select_crypto");
// controllo nel caso ci fosse un change di valore nel input del filtro per crypto
filter_by_name.addEventListener("input", (selected_event) => {
  selected_crypto = selected_event.target.value;
  localStorage.setItem("selected_crypto", selected_crypto);
  sort_crypto_by_name();
});

// listener sul change del filtro campo
let filter_by_field = document.getElementById("select_field");
// controllo nel caso ci fosse un change di valore nel input del filtro per crypto
filter_by_field.addEventListener("input", (selected_event) => {
  selected_field = selected_event.target.value;
  if (selected_field == "quantity") {
    user_crypto.sort(function (a, b) {
      return b.quantity - a.quantity;
    });
    sort_crypto_by_name();
  } else if (selected_field == "rateo") {
    user_crypto.sort(function (a, b) {
      return b.rateo - a.rateo;
    });
    sort_crypto_by_name();
  } else {
    user_crypto.sort(function (a, b) {
      return b.date - a.date;
    });
    sort_crypto_by_name();
  }
});

var count_display = 0;
function display_tooltip() {
  if (count_display % 2 == 0) {
    let tooltip_box = document.querySelector("#tooltip-box");
    let tooltiptext1 = document.querySelector("#tooltiptext1");
    let tooltiptext2 = document.querySelector("#tooltiptext2");
    let tooltiptext3 = document.querySelector("#tooltiptext3");
    let tooltiptext4 = document.querySelector("#tooltiptext4");
    tooltip_box.style.display = "flex";
    tooltiptext1.style.display = "block";
    tooltiptext2.style.display = "block";
    tooltiptext3.style.display = "block";
    tooltiptext4.style.display = "block";
    count_display++;
  } else {
    let tooltip_box = document.querySelector("#tooltip-box");
    let tooltiptext1 = document.querySelector("#tooltiptext1");
    let tooltiptext2 = document.querySelector("#tooltiptext2");
    let tooltiptext3 = document.querySelector("#tooltiptext3");
    let tooltiptext4 = document.querySelector("#tooltiptext4");
    tooltip_box.style.display = "none";
    tooltiptext1.style.display = "none";
    tooltiptext2.style.display = "none";
    tooltiptext3.style.display = "none";
    tooltiptext4.style.display = "none";
    count_display++;
  }
}
