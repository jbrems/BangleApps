const locale = require('locale');
const heatshrink = require('heatshrink');

const skyrimDateBorder = heatshrink.decompress(atob("5sbgI2zgUD/4AS+EgDIMoAYQARoWAGQMih4XRgfBkQEBkGAxAZRiMChAyBAYNADKOEkBiBkEIwQYRgkCoGAGQUQDKMgoMCAYJmBQgIAPgMBgkIGQUEGSMIkkQGIMIxDNSoURgB8BkEhDCMCkEQAQMAZicSgJPBTQLMTxCtBJgNIZichiEIS4LMUyDmBkACBZiUCF4MAwLMUPQJ+BgmQZiVBkgyBMgNBZiUQGQJqBoIdBACERMoUAxMH4AZR+FIGQMCwgXRZoUoQgUf/4AS4DHRAEQA=="));
const skyrimLogo = heatshrink.decompress(atob("m1mhH+AH4A96/XBrI1/GiA1OG0g10EoQnLBxxqbGpZskEYg1MG0YiSGsIhUGu42eEA4nMGr4fCGowVUGsBrOGrYeJExo2dDpRzMGrgcDGpivJGzQcKBQhCKGrI0YGzg1RFBA1ZE5Y1HbBg2UGqBiKGrBaOCpLnTNSwWKUTZNMGphsbQa41cCow1TKjQ1XCQ4fVGqzpKD6QUHC5gOJDygWUBpY1VCZQoMDxAiMaqaTJDxLZUI6L4QEiR8VGpwlPNSo1YfBY1vGiISGGq4YEGqQ2eISAOCEBQuINiA1OEQpISFJgKJLJIAPDCJrQGt69PDDImWADpcXGv6wjGlI12G1w0GGuw2sGhA12G1Q0KGpJAVEBg2SBYo6KBoYfOGrAQIBow1iBgI1MD6I2QCB4eYCy41jEhoQRGio12C4gQZGixsVNT5ORGp40UJ6AOKNTIbGZSQXOGqiVQCxw1WSxYVRNj5qlGu73MBA40gEJYIMGroiFGhgSJGsoSPGzxqMBRY1iCJw2gGqA0gEg413a5Q1hMo41KGkQ12EwI1OGkjNrU6w0vGuSf/Nf41qHlo2GOVw1CGASnwGwbdxGuo2FGl412GwY0xGuw2CGug0zADYA=="));

let timeUpdateLoop;
let dateUpdate;

function setUpWatchers() {
  Bangle.on('lcdPower', on => {
    if (on) startApp();
    else stopApp();
  });

  setWatch(showLauncher, BTN2, { repeat: false, edge: 'falling' });
}

function startApp() {
  drawApp();

  if (timeUpdateLoop) clearInterval(timeUpdateLoop);
  timeUpdateLoop = setInterval(updateTime, 1000);

  if (dateUpdate) clearTimeout(dateUpdate);
  dateUpdate = setTimeout(updateDate, getMsTillMidnight());

  Bangle.loadWidgets();
  Bangle.drawWidgets();
}

function stopApp() {
  if (timeUpdateLoop) clearInterval(timeUpdateLoop);
  if (dateUpdate) clearTimeout(dateUpdate);
  timeUpdateLoop = undefined;
  dateUpdate = undefined;
}

function showLauncher() {
  stopApp();
  Bangle.showLauncher();
}

function drawApp() {
  g.reset();
  g.clear();

  drawStatic();

  const now = new Date();
  drawDate(now);
  drawTime(now);
  drawSkyrimDate(now);
}

function updateTime() {
  g.reset();
  drawTime(new Date());
}

function updateDate() {
  g.reset();

  const date = new Date();
  drawDate(date);
  drawSkyrimDate(date);
}

function getMsTillMidnight() {
  const dayStart = new Date();
  dayStart.setHours(0);
  dayStart.setMinutes(0);
  dayStart.setSeconds(0);
  dayStart.setMilliseconds(0);
  const msSinceDayStart = Date.now() - dayStart.getTime();
  const msInDay = 1000 * 60 * 60 * 24;
  return msInDay - msSinceDayStart;
}

function drawStatic() {
  g.drawImage(skyrimDateBorder, 17, 35);
  g.drawImage(skyrimLogo, 180, 85);
}

function drawDate(now) {
  g.clearRect(46, 39, 193, 57);

  const dateString = locale.date(now);

  g.setFont('Vector12', 16);
  const length = g.stringWidth(dateString);
  g.drawString(dateString, (g.getWidth() - length) / 2, 41);
}

function drawTime(now) {
  g.clearRect(15, 80, 180, 120);

  g.setFont('Vector12', 45);
  g.drawString(zeroPad(now.getHours()), 15, 80);
  g.drawString(':', 75, 76);
  g.drawString(zeroPad(now.getMinutes()), 90, 80);

  g.setFont('Vector12', 20);
  g.drawString(zeroPad(now.getSeconds()), 148, 101);
}

function zeroPad(number) {
  return ('0' + number).slice(-2);
}

function drawSkyrimDate(now) {
  const skyrimDays = ['Sundas', 'Morndas', 'Tirdas', 'Middas', 'Turdas', 'Fredas', 'Loredas'];
  const skyrimMonths = ['Morning Star', `Sun's Dawn`, 'First Seed', `Rain's Hand`, 'Second Seed', 'Mid Year', `Sun's Height`, 'Last Seed', 'Hearthfire', 'Frost Fall', `Sun's Dusk`, 'Evening Star'];

  g.clearRect(15, 140, 180, 160);
  g.clearRect(15, 170, 200, 190);

  g.setFont('Vector12', 16);

  g.drawString(skyrimDays[now.getDay()], 15, 140);

  const monthString = `${now.getDate()}${getDateSuffix(now.getDate())} of ${skyrimMonths[now.getMonth()]}`;
  g.drawString(monthString, 15, 170);
}

function getDateSuffix(date) {
  if (date.toString().endsWith('1') && date !== 11) return 'st';
  if (date.toString().endsWith('2') && date !== 12) return 'nd';
  if (date.toString().endsWith('3') && date !== 13) return 'rd';
  return 'th';
}

setUpWatchers();
startApp();
