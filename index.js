let startWindow, stopWindow;

const startBtn = document.querySelector("#start");
const stopBtn = document.querySelector("#stop");

const timeoutInput = document.querySelector("#timeoutInput");
const usdInp = document.querySelector("#usdInp");
const eurInp = document.querySelector("#eurInp");
const rubInp = document.querySelector("#rubInp");

const validate = () => {
  if (timeoutInput.value <= 0 || (!usdInp.checked && !eurInp.checked && !rubInp.checked)) {
    startBtn.disabled = true;
  } else startBtn.disabled = false;
};

validate();

let startingAdType = 1;
const onChangeInp = () => {
  validate();
  if (usdInp.checked) {
    startingAdType = 1;
  } else if (eurInp.checked) {
    startingAdType = 3;
  } else {
    startingAdType = 5;
  }
};

const start = () => {
  const newAddUrl = `https://miniaylo.finance.ua/add?accNumber=1&adType=${startingAdType}&timeout=${timeoutInput.value}&usd=${usdInp.checked}&eur=${eurInp.checked}&rub=${rubInp.checked}&startingAdType=${startingAdType}`;
  startWindow = window.open(newAddUrl);
};

const stop = () => {
  if (startWindow) {
    startWindow.close();
  }
  const removeUrl = `https://miniaylo.finance.ua/remove?accNumber=1&adType=${startingAdType}&usd=${
    usdInp.checked
  }&eur=${eurInp.checked}&rub=${rubInp.checked}&accsAmount=${3}&mode=stop`;
  stopWindow = window.open(removeUrl);
};

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
timeoutInput.addEventListener("input", onChangeInp);
usdInp.addEventListener("input", onChangeInp);
eurInp.addEventListener("input", onChangeInp);
rubInp.addEventListener("input", onChangeInp);
