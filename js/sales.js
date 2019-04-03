'use-strict';

var hours = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm'];
var table = document.getElementById('locationtable');

function CookieStand(locationName, minCustomersPerHour, maxCustomersPerHour, avgCookiesPerSale) {
  this.locationName = locationName;
  this.minCustomersPerHour = minCustomersPerHour;
  this.maxCustomersPerHour = maxCustomersPerHour;
  this.avgCookiesPerSale = avgCookiesPerSale;
  this.customersEachHour = [];
  this.cookiesEachHour = [];
  this.totalDailyCookies = 0;
  CookieStand.all.push(this);
}

CookieStand.prototype.calcCustomersEachHour = function() {
  for (var i = 0; i < hours.length; i++) {
    this.customersEachHour.push(random(this.minCustomersPerHour, this.maxCustomersPerHour));
  }
};

CookieStand.prototype.calcCookiesEachHour = function() {
  this.calcCustomersEachHour();
  for (var i = 0; i < hours.length; i++) {
    var oneHour = Math.ceil(this.customersEachHour[i] * this.avgCookiesPerSale);
    this.cookiesEachHour.push(oneHour);
    this.totalDailyCookies += oneHour;
  }
};

CookieStand.prototype.render = function() {
  this.calcCookiesEachHour();
  var tr = document.createElement('tr');

  var td = document.createElement('td');
  td.textContent = this.locationName;
  tr.appendChild(td);

  for (var i = 0; i < hours.length; i++) {
    td = document.createElement('td');
    td.textContent = this.cookiesEachHour[i];
    tr.appendChild(td);
  }

  th = document.createElement('th');
  th.textContent = this.totalDailyCookies;
  tr.appendChild(th);

  table.appendChild(tr);
}

CookieStand.all = [];

new CookieStand('Pike Place Market', 23, 65, 6.3, 'pike');
new CookieStand('SeaTac Airport', 3, 24, 1.2, 'seatac');
new CookieStand('Seattle Center', 11, 38, 3.7, 'seattlecenter');
new CookieStand('Capitol Hill', 20, 38, 2.3, 'caphill');
new CookieStand('Alki', 2, 16, 4.6, 'alki');

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleForm(e){
  e.preventDefault();
  // console.log('event object', e);
  var loc = e.target.locName.value;
  var min = parseInt(e.target.min.value);
  var max = parseInt(e.target.max.value);
  var avg = parseFloat(e.target.avg.value);

  var newStore = new CookieStand(loc, min, max, avg);

  e.target.locName.value = null;
  e.target.min.value = null;
  e.target.max.value = null;
  e.target.avg.value = null;

  renderTable();
}

function makeHeaderRow() {
  var tr = document.createElement('tr');

  var th = document.createElement('th');
  th.textContent = 'Locations';
  tr.appendChild(th);

  for (var i = 0; i < hours.length; i++) {
    th = document.createElement('th');
    th.textContent = hours[i];
    tr.appendChild(th);
  }

  th = document.createElement('th');
  th.textContent = 'Location Totals';
  tr.appendChild(th);

  table.appendChild(tr);
}

function makeFooterRow() {
  var tr = document.createElement('tr');

  var th = document.createElement('th');
  th.textContent = 'Hourly Totals for All Locations';
  tr.appendChild(th);

  var totalOfTotals = 0;
  var hourlyTotal = 0;

  for (var i = 0; i < hours.length; i++) {
    hourlyTotal = 0;
    for (var j = 0; j < CookieStand.all.length; j++){
      hourlyTotal += CookieStand.all[j].cookiesEachHour[i];
      // console.log('one hourly total', CookieStand.all[j].cookiesEachHour[i]);
      // console.log('running total for this hour', hourlyTotal);
      totalOfTotals += CookieStand.all[j].cookiesEachHour[i];
      // console.log('total of totals', totalOfTotals);
    }
    th = document.createElement('th');
    th.textContent = hourlyTotal;
    tr.appendChild(th);
  }

  th = document.createElement('th');
  th.textContent = totalOfTotals;
  tr.appendChild(th);

  table.appendChild(tr);
}

function renderTable() {
  table.innerHTML = '';
  makeHeaderRow();
  for(var i = 0; i < CookieStand.all.length; i++){
    CookieStand.all[i].render();
  }
  makeFooterRow();
}

renderTable();