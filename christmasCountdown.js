(function () {
  'use strict';

  function tick() {
    let now = new Date();
    let year = now.getFullYear();
    let evenDate = new Date(year, 11, 25);

    // Roll over to next year only after Christmas Day has fully passed,
    // so visitors on Dec 25 see 0d 00:00:00 instead of ~365 days.
    if (now > new Date(year, 11, 26)) {
      evenDate = new Date(year + 1, 11, 25);
    }

    let remTime = evenDate.getTime() - now.getTime();
    if (remTime < 0) remTime = 0;

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

    if (document.querySelector('#to-christmas-days') != null) {
      document.querySelector('#to-christmas-days').textContent = d;
    }
    if (document.querySelector('#to-christmas-hours') != null) {
      document.querySelector('#to-christmas-hours').textContent = h;
    }
    if (document.querySelector('#to-christmas-minutes') != null) {
      document.querySelector('#to-christmas-minutes').textContent = m;
    }
    if (document.querySelector('#to-christmas-seconds') != null) {
      document.querySelector('#to-christmas-seconds').textContent = s;
    }

    setTimeout(tick, 1000);
  }

  tick();
})();
