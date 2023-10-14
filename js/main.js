document.getElementById('save').addEventListener('click', addToLocal);
document.getElementById('clear').addEventListener('click', clearLocal);
buildTable();

function addToLocal(){
  const date = document.querySelector('#date').value; //YYYY-MM-DD
  const expl = document.querySelector('#reason').value; // raw text
  const url = `http://numbersapi.com/${date.split('-')[1]}/${date.split('-')[2]}/date?json`

  fetch(url)
      .then(res => res.json())
      .then(data => {
        const fact = data.found ? data.text : 'No fact found';
        // want to save in local storage w/ date as key, and value being an array with [expl, fact]
        // have to use JSON.stringify + JSON.parse for array, since local storage only deals in strings
        localStorage.setItem(date.split('-').join(''),JSON.stringify([expl,fact]));
        buildTable();
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
};

function buildTable() {
  let allDatesObject = {...localStorage};
  let allDates = Object.keys(allDatesObject);
  let tableDates = document.querySelector('#savedDates');

  tableDates.innerHTML = '';
  allDates.forEach(d=>{
    tableDates.innerHTML += (`<tr><td class="date">${strToDate(d)}</td><td class="expl">${JSON.parse(allDatesObject[d])[0]}</td><td class="fact">${JSON.parse(allDatesObject[d])[1]}</td></tr>`)
  })
};

function strToDate(str) { // input is 8 digit string in form of YYYYMMDD
  const year = str.slice(0,4);
  let month = str.slice(4,6);
  const day = str.slice(6,8);

  switch (month) {
    case '01':
      month = 'January';
      break;
    case '02':
      month = 'February';
      break;
    case '03':
      month = 'March';
      break;
    case '04':
      month = 'April';
      break;
    case '05':
      month = 'May';
      break;
    case '06':
      month = 'June';
      break;
    case '07':
      month = 'July';
      break;
    case '08':
      month = 'August';
      break;
    case '09':
      month = 'September';
      break;
    case '10':
      month = 'October';
      break;
    case '11':
      month = 'November';
      break;
    case '12':
      month = 'December';
      break;
    default:
      month = "Unrecognized Month";
  };

  return `${month} ${day}, ${year}`;
};

function clearLocal() {
  localStorage.clear();
  buildTable();
}