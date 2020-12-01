const startBtn = document.querySelector("#start");

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

const onChangeInp = () => {
  validate();
};

const start = () => {
  const loginUrl = `https://passport.i.ua/login/?acc=1&timeout=${timeoutInput.value}&usd=${usdInp.checked}&eur=${eurInp.checked}&rub=${rubInp.checked}`;
  window.open(loginUrl);
};

startBtn.addEventListener("click", start);
timeoutInput.addEventListener("input", onChangeInp);
usdInp.addEventListener("input", onChangeInp);
eurInp.addEventListener("input", onChangeInp);
rubInp.addEventListener("input", onChangeInp);
