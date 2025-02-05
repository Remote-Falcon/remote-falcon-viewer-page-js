function countdown() {
  const urlParams = new URLSearchParams(window.location.search);
  const year = urlParams.get('customCountdownYear');
  const month = urlParams.get('customCountdownMonth');
  const day = urlParams.get('customCountdownDay');

  let now = new Date();
  let evenDate = new Date(Number(year), Number(month), Number(day));

  let actualTime = now.getTime();
  let eventTime = evenDate.getTime();
  let remTime = eventTime - actualTime;

  let s = Math.floor(remTime / 1000);
  let m = Math.floor(s / 60);
  let h = Math.floor(m / 60);
  let d = Math.floor(h / 24);

  h %= 24;
  m %= 60;
  s %= 60;

  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;

  if(document.querySelector('#custom-countdown-days') != null) {
    document.querySelector('#custom-countdown-days').textContent = d;
  }
  if(document.querySelector('#custom-countdown-hours') != null) {
    document.querySelector('#custom-countdown-hours').textContent = h;
  }
  if(document.querySelector('#custom-countdown') != null) {
    document.querySelector('#custom-countdown').textContent = m;
  }
  if(document.querySelector('#custom-countdown-seconds') != null) {
    document.querySelector('#custom-countdown-seconds').textContent = s;
  }

  setTimeout(countdown, 1000)
};

countdown();