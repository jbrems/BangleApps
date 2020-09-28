const locale = require('locale');

(() => {
  let timeUpdateLoop;
  let dateUpdate;

  setUpWatchers();
  startApp();

  function setUpWatchers () {
    Bangle.on('lcdPower', on => {
      if (on) startApp();
      else stopApp();
    });

    setWatch(showLauncher, BTN2, { repeat: false, edge: 'falling' });
  }

  function startApp () {
    drawApp();

    timeUpdateLoop = setInterval(updateTime, 1000);
    dateUpdate = setTimeout(updateDate, getMsTillMidnight());

    Bangle.loadWidgets();
    Bangle.drawWidgets();
  }

  function stopApp () {
    if (timeUpdateLoop) clearInterval(timeUpdateLoop);
    if (dateUpdate) clearTimeout(dateUpdate);
  }

  function showLauncher () {
    stopApp();
    Bangle.showLauncher();
  }

  function drawApp () {
    g.reset();
    g.clear();

    drawStatic();

    const now = new Date();
    drawDate(now);
    drawTime(now);
    drawSkyrimDate(now);
  }

  function updateTime () {
    g.reset();
    drawTime(new Date());
  }

  function updateDate () {
    g.reset();

    const date = new Date();
    drawDate(date);
    drawSkyrimDate(date);
  }

  function getMsTillMidnight () {
    const dayStart = new Date();
    dayStart.setHours(0);
    dayStart.setMinutes(0);
    dayStart.setSeconds(0);
    dayStart.setMilliseconds(0);
    const msSinceDayStart = Date.now() - dayStart.getTime();
    const msInDay = 1000 * 60 * 60 * 24;
    return msInDay - msSinceDayStart;
  }

  function drawStatic () {
    drawDateBorder();
    drawLogo();
  }

  function drawDateBorder () {
    const xOffset = 10;
    const yOffset = 35;
    const scale = 2;

    const moveTo = createScaledMoveToWithOffsetFn(xOffset, yOffset, scale);
    const lineTo = createScaledLineToWithOffsetFn(xOffset, yOffset, scale);
    const moveToInverse = createScaledMoveToWithOffsetFn(xOffset, yOffset, scale, true);
    const lineToInverse = createScaledLineToWithOffsetFn(xOffset, yOffset, scale, true);

    // Draw left diamond
    moveTo(0, 6);
    lineTo(6, 0);
    lineTo(12, 6);
    lineTo(6, 12);
    lineTo(0, 6);

    // Draw left pattern
    moveTo(10, 0);
    lineTo(6, 4);
    lineTo(12, 11);
    lineTo(14, 11);
    lineTo(14, 1);
    lineTo(12, 1);
    lineTo(6, 8);
    lineTo(10, 12);

    // Draw right pattern
    lineToInverse(10, 12);
    lineToInverse(6, 8);
    lineToInverse(12, 1);
    lineToInverse(14, 1);
    lineToInverse(14, 11);
    lineToInverse(12, 11);
    lineToInverse(6, 4);
    lineToInverse(10, 0);
    lineTo(10, 0);

    // Draw right diamond
    moveToInverse(0, 6);
    lineToInverse(6, 0);
    lineToInverse(12, 6);
    lineToInverse(6, 12);
    lineToInverse(0, 6);

    const black = '#000000';
    // Remove left pixels for line intersections
    g.setPixel(27, 38, black);
    g.setPixel(25, 40, black);
    g.setPixel(29, 42, black);
    g.setPixel(30, 43, black);
    g.setPixel(29, 51, black);
    g.setPixel(30, 52, black);
    g.setPixel(27, 54, black);
    g.setPixel(25, 56, black);
    g.setPixel(25, 48, black);
    g.setPixel(26, 46, black);

    // Remove right pixels for line intersections
    g.setPixel(g.getWidth() - 27, 38, black);
    g.setPixel(g.getWidth() - 25, 40, black);
    g.setPixel(g.getWidth() - 29, 42, black);
    g.setPixel(g.getWidth() - 30, 43, black);
    g.setPixel(g.getWidth() - 29, 51, black);
    g.setPixel(g.getWidth() - 30, 52, black);
    g.setPixel(g.getWidth() - 27, 54, black);
    g.setPixel(g.getWidth() - 25, 56, black);
    g.setPixel(g.getWidth() - 25, 48, black);
    g.setPixel(g.getWidth() - 26, 46, black);
  }

  function createScaledMoveToWithOffsetFn (xOffset, yOffset, scale, inverse) {
    return function (x, y) {
      if (inverse) g.moveTo(g.getWidth() - xOffset - x * scale, yOffset + y * scale);
      else g.moveTo(xOffset + x * scale, yOffset + y * scale);
    };
  }

  function createScaledLineToWithOffsetFn (xOffset, yOffset, scale, inverse) {
    return function (x, y) {
      if (inverse) g.lineTo(g.getWidth() - xOffset - x * scale, yOffset + y * scale);
      else g.lineTo(xOffset + x * scale, yOffset + y * scale);
    };
  }

  function drawLogo () {
    const logo = E.toArrayBuffer(atob("NmaBAAAAAAAAAAAAAAAAAAAAAAGABgAAAAAGABgAAAAAOABwAAAAAOABwAAAAAfAD4AAAAAdAC4AAAAA5ACcAAAAA4AAcAAAABwAAMAAAABwAAOAAAABwYAOAAAADwQAPAAAADwYAPAAAAHgYAHgAAAHgMGHgAAAPgMcHwAAAPgfwHwAAAfA/gD4AAAfA/wD4AAA/A/+D8AAA/A+fD8AAB/BwHD+AAB+BgDB+AAD+BgDh/AAD+AADh/AAH+AADB/AAH+AAHB/gAH+AAOB/gAP/gB8H/wAP/gH4H/wAf8wPgM/4Af4QeAIf4A/4A8AAf8A/wA8AAP8B/wB8AAP+B/wB8AAP+D/gB+AAP/D/gA/AAH/H/gw/gMH/n/gY/wYH/v/gP//wH/3/gP//wH/3/wf//4P/j////////D////////D////////B///////+B///////+A///////8A///////8Af//////4Af//////4AP//////wAP+f//5/wAH+G/9h/gAH+GP5h/gAH+CP5B/gAD+AH4B/AAD+AD4B/AAB8AD4A+AAB8AD4A+AAA8AB4A8AAA+AB4B8AAAeAB4B4AAAfAB4D4AAAPwB4PwAAAP4B4fwAAAP8B4/wAAAH8Bw/gAAAH8Bw/gAAAD8Dg/AAAAD8Hg/AAAAB8PA+AAAAB8OA+AAAAA8eA8AAAAA8cA8AAAAAccA4AAAAAcMA4AAAAAcOA4AAAAAMGAwAAAAAMGAwAAAAAEGAgAAAAAAOAAAAAAAAMAAAAAAAAcAAAAAAAA4AAAAAAAAwAAAAAAAA4AAAAAAAA4EAAAAAAAcMAAAAAAAeYAAAAAAAP4AAAAAAAP4AAAAAAAHwAAAAAAAHwAAAAAAADgAAAAAAADgAAAAAAABgAAAAAAABAAAAAAAAAAAAAA"));

    g.drawImage(logo, 180, 85);
  }

  function drawDate (now) {
    g.clearRect(40, 37, 200, 57);

    const dateString = locale.date(now);

    g.setFont('Vector12', 13);
    const length = g.stringWidth(dateString);
    g.drawString(dateString, (g.getWidth() - length) / 2, 40);
  }

  function drawTime (now) {
    g.clearRect(15, 80, 180, 120);

    g.setFont('Vector12', 35);
    g.drawString(zeroPad(now.getHours()), 15, 80);

    g.drawString(':', 76, 76);

    g.drawString(zeroPad(now.getMinutes()), 90, 80);

    g.setFont('Vector12', 14);
    g.drawString(zeroPad(now.getSeconds()), 150, 101);
  }

  function zeroPad (number) {
    return ('0' + number).slice(-2);
  }

  function drawSkyrimDate (now) {
    const skyrimDays = ['Sundas', 'Morndas', 'Tirdas', 'Middas', 'Turdas', 'Fredas', 'Loredas'];
    const skyrimMonths = ['Morning Star', `Sun's Dawn`, 'First Seed', `Rain's Hand`, 'Second Seed', 'Mid Year', `Sun's Height`, 'Last Seed', 'Hearthfire', 'Frost Fall', `Sun's Dusk`, 'Evening Star'];

    g.clearRect(15, 140, 180, 160);
    g.clearRect(15, 170, 200, 190);

    g.setFont('Vector12', 13);
    g.drawString(skyrimDays[now.getDay()], 15, 140);

    const monthString = `${now.getDate()}${getDateSuffix(now.getDate())} of ${skyrimMonths[now.getMonth()]}`;
    g.drawString(monthString, 15, 170);
  }

  function getDateSuffix (date) {
    if (date.toString().endsWith('1') && date !== 11) return 'st';
    if (date.toString().endsWith('2') && date !== 12) return 'nd';
    if (date.toString().endsWith('3') && date !== 13) return 'rd';
    return 'th';
  }
})();
