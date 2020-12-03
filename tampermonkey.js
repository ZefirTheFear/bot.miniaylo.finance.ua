// create ads
// ----- https://miniaylo.finance.ua/add* ------
const deleteCookie = (cookieName) => {
  document.cookie = `${cookieName}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=finance.ua`;
};

const accNumber = new URLSearchParams(window.location.search).get("accNumber");
const adType = new URLSearchParams(window.location.search).get("adType");
const startingAdType = new URLSearchParams(window.location.search).get("startingAdType");
const timeout = new URLSearchParams(window.location.search).get("timeout");

const usd = new URLSearchParams(window.location.search).get("usd");
const eur = new URLSearchParams(window.location.search).get("eur");
const rub = new URLSearchParams(window.location.search).get("rub");

const accs = [
  {
    phone: atob("MDYzMTIzMTAyMw=="),
    activationCode: atob("NTA1ODg4"),
    sumUsd: 33000,
    sumEur: 20000,
    sumRub: 770000,
    comment: "💰Обменник. Центр. Саксаганского. Жилянская. Обмен криптовалют.💰"
  },
  {
    phone: atob("MDUwODMyNDE2Mg=="),
    activationCode: atob("NjI5OTU4"),
    sumUsd: 27000,
    sumEur: 12000,
    sumRub: 550000,
    comment: "Ⓜ️ Университет Ⓜ️ Вокзальная. Обменный пункт."
  },
  {
    phone: atob("MDY2NjE1MTc1OA=="),
    activationCode: atob("ODQ5MDky"),
    sumUsd: 31000,
    sumEur: 11000,
    sumRub: 680000,
    comment: "💵Обменка центр. Бульвар Шевченка. Цирк. Пл. Победы.💵"
  }
];

const startNewCycle = () => {
  window.location.replace(
    `https://miniaylo.finance.ua/remove?accNumber=1&adType=${startingAdType}&timeout=${timeout}&usd=${usd}&eur=${eur}&rub=${rub}&startingAdType=${startingAdType}`
  );
  // window.location.replace(
  //   `https://miniaylo.finance.ua/add?accNumber=1&adType=${startingAdType}&timeout=${timeout}&usd=${usd}&eur=${eur}&rub=${rub}&startingAdType=${startingAdType}`
  // );
};

const adTypes = [];
if (usd === "true") {
  adTypes.push("1");
  adTypes.push("2");
}
if (eur === "true") {
  adTypes.push("3");
  adTypes.push("4");
}
if (rub === "true") {
  adTypes.push("5");
  adTypes.push("6");
}

let nextAccNumber;
let nextAdType;
if (adTypes.indexOf(adType) === adTypes.length - 1) {
  nextAccNumber = +accNumber + 1;
  nextAdType = adTypes[0];
} else {
  nextAccNumber = accNumber;
  nextAdType = adTypes[adTypes.indexOf(adType) + 1];
}

const addNewAd = async (acc, adType) => {
  const errDiv = document.querySelectorAll(".error-list")[8];
  const observerConfig = { attributes: true, childList: true, subtree: true };
  const callbackForErrDiv = (mutationsList, observer) => {
    // const errText = document.querySelectorAll(".error-list")[8].querySelector("li").innerText;
    // if (mutationsList.length > 0 && errText.indexOf("Ви вже розміщували заявку") > -1) {
    if (mutationsList.length > 0) {
      setTimeout(() => {
        window.location.reload();
      }, 5 * 1000);
    }
  };
  const observerForErrDiv = new MutationObserver(callbackForErrDiv);
  observerForErrDiv.observe(errDiv, observerConfig);

  // saving proposalNumber and removalCode to cookies
  let proposalNumber = "#";
  let removalCode = "#";
  const proposalNumberSpan = document.querySelector('span[data-role="proposal-no-placeholder"]');
  const removalCodeSpan = document.querySelector('span[data-role="removal-code-placeholder"]');

  // decide go next or delete cookie and repeat
  const decideWhatNext = () => {
    if (proposalNumber.indexOf("#") === -1 && removalCode.indexOf("#") === -1) {
      const ad = {
        proposalNumber: proposalNumber,
        removalCode: removalCode
      };
      document.cookie = `ad11=${JSON.stringify(ad)};path=/;domain=finance.ua`;

      const msgDiv = document.querySelectorAll(".error-list")[9];
      const callbackforMsgDiv = (mutationsList, observer) => {
        if (
          mutationsList.length > 0 &&
          document.querySelectorAll(".error-list")[9].querySelector("li").innerText ===
            "Ваша заявка успішно активована"
        ) {
          window.location.replace(
            `https://miniaylo.finance.ua/add?accNumber=${nextAccNumber}&adType=${nextAdType}&timeout=${timeout}&usd=${usd}&eur=${eur}&rub=${rub}&startingAdType=${startingAdType}`
          );
        } else {
          deleteCookie(`ad${accNumber}${adType}`);
          window.location.reload();
        }
      };
      const observerForMsgDiv = new MutationObserver(callbackforMsgDiv);
      observerForMsgDiv.observe(msgDiv, observerConfig);

      // activate
      // document.body.querySelector("#currency_proposal_activate_by_pin_code_pin_code").value =
      //   acc.activationCode;
      // document.body.querySelectorAll(".button")[2].click();
    }
  };

  const callbackForProposalNumber = (mutationsList, observer) => {
    if (mutationsList.length > 0) {
      proposalNumber = mutationsList[0].target.innerText;
      decideWhatNext();
    }
  };
  const callbackForRemovalCode = (mutationsList, observer) => {
    if (mutationsList.length > 0) {
      removalCode = mutationsList[0].target.innerText;
      decideWhatNext();
    }
  };
  const observerForProposalNumber = new MutationObserver(callbackForProposalNumber);
  const observerForRemovalCode = new MutationObserver(callbackForRemovalCode);
  observerForProposalNumber.observe(proposalNumberSpan, observerConfig);
  observerForRemovalCode.observe(removalCodeSpan, observerConfig);

  // fetching rates
  let rates;
  const getRates = async () => {
    try {
      const response = await fetch(
        `https://exchange-currencies-obolon.firebaseio.com/currencies.json`
      );
      if (response.status !== 200) {
        return console.log("не могу запросить курсы. ёбаный firebase");
      }
      const resData = await response.json();
      rates = resData.rates.opt;
    } catch (error) {
      return console.log("не могу запросить курсы. ёбаный firebase");
    }
  };

  await getRates();

  // город
  // document.querySelector('.major-location-list').querySelectorAll('li')[0].click();
  document.querySelector(".major-location-list").querySelectorAll("li")[2].click();

  // тип заявки
  if (adType === "1" || adType === "3" || adType === "5") {
    document
      .querySelector("#currency_proposal_type")
      .querySelector('option[value="1"]').selected = true;
    document.querySelectorAll(".ik_select_link_text")[0].click();
    document.body.click();
  } else {
    document
      .querySelector("#currency_proposal_type")
      .querySelector('option[value="0"]').selected = true;
    document.querySelectorAll(".ik_select_link_text")[0].click();
    document.body.click();
  }

  // курс
  let ratio;
  switch (adType) {
    case "1":
      ratio = rates.usd.sell;
      break;
    case "2":
      ratio = rates.usd.buy;
      break;
    case "3":
      ratio = rates.eur.sell;
      break;
    case "4":
      ratio = rates.eur.buy;
      break;
    case "5":
      ratio = rates.rub.sell;
      break;
    case "6":
      ratio = rates.rub.buy;
      break;

    default:
      break;
  }
  document.querySelector("#currency_proposal_rate").value = ratio;

  // сумма
  let sum;
  switch (adType) {
    case "1":
      sum = acc.sumUsd;
      break;
    case "2":
      sum = acc.sumUsd;
      break;
    case "3":
      sum = acc.sumEur;
      break;
    case "4":
      sum = acc.sumEur;
      break;
    case "5":
      sum = acc.sumRub;
      break;
    case "6":
      sum = acc.sumRub;
      break;

    default:
      break;
  }
  document.querySelector("#currency_proposal_amount").value = sum;

  // валюта
  let currency;
  if (adType === "1" || adType === "2") {
    currency = "USD";
  } else if (adType === "3" || adType === "4") {
    currency = "EUR";
  } else if (adType === "5" || adType === "6") {
    currency = "RUB";
  }
  document
    .querySelector("#currency_proposal_currency")
    .querySelector(`option[value=${currency}]`).selected = true;
  document.querySelectorAll(".ik_select_link_text")[1].click();
  document.body.click();

  // частями
  document.querySelector("#currency_proposal_attr_bypart").click();

  // коммент
  document.querySelector("#currency_proposal_comment").value = acc.comment;

  // телефон
  document.querySelector("#currency_proposal_profile").value = acc.phone;

  // актуально до
  // document.body.querySelector('#currency_proposal_expired_at').querySelector('option[value="' + expires + '"]').selected = true;
  document
    .querySelector("#currency_proposal_expired_at")
    .querySelector('option[value="24"]').selected = true;
  document.querySelectorAll(".ik_select_link_text")[2].click();
  document.body.click();

  // отправить;
  document.querySelector(".form-buttons").querySelector("div").click();
};

const createNewAdOrStartNewCycle = () => {
  console.log("Loaded!!!!");
  if (accNumber > accs.length) {
    setTimeout(startNewCycle, 1000 * timeout);
  } else {
    addNewAd(accs[accNumber - 1], adType);
  }
};

window.addEventListener("load", createNewAdOrStartNewCycle);
// --------------------------------------------

// remove ads
// ----- https://miniaylo.finance.ua/remove* ------
const deleteCookie = (cookieName) => {
  document.cookie = `${cookieName}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=finance.ua`;
};

const accNumber = new URLSearchParams(window.location.search).get("accNumber");
const adType = new URLSearchParams(window.location.search).get("adType");
const startingAdType = new URLSearchParams(window.location.search).get("startingAdType");
const timeout = new URLSearchParams(window.location.search).get("timeout");

const usd = new URLSearchParams(window.location.search).get("usd");
const eur = new URLSearchParams(window.location.search).get("eur");
const rub = new URLSearchParams(window.location.search).get("rub");

// ------------------------------------------------
