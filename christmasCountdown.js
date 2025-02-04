function countdown() {
  const daysElement = document.createElement("span");
  daysElement.setAttribute("id", "to-christmas-days-span");

  const hoursElement = document.createElement("span");
  hoursElement.setAttribute("id", "to-christmas-hours-span");

  const minutesElement = document.createElement("span");
  minutesElement.setAttribute("id", "to-christmas-minutes-span");

  const secondsElement = document.createElement("span");
  secondsElement.setAttribute("id", "to-christmas-seconds-span");

  let now = new Date();
  let evenDate = new Date(2025, 11, 25);

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

  daysElement.textContent = d;
  hoursElement.textContent = h;
  minutesElement.textContent = m;
  secondsElement.textContent = s;

  setTimeout(countdown, 1000)
};

countdown();