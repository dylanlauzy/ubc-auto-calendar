import { after } from "node:test";

const HOURS_PER_BLOCK = 0.5;
const FIRST_HOUR = 9;

const MONTH_KEY = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

const DAY_KEY = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 0,
}

console.log("injected script");

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type } = obj;

  if (type === "RETRIEVE_CLASSES") {
    retrieveClasses();
  }
});

const retrieveClasses = () => {
  const t1Year = document.getElementById("term1").previousElementSibling.innerText.match(/\d{4}/g);
  const t1Cells = document.querySelectorAll("#term1 table.time-table td.tt-registered");
  for (let cell of t1Cells) {
    extractClassData(cell, t1Year);
  }

  const t2Cells = document.querySelectorAll("#term2 table.time-table td.tt-registered");
  const t2Year = t1Year + 1
  for (let cell of t2Cells) {
    extractClassData(cell, t2Year);
  }
};

const extractClassData = (cell, year) => {
  const summary = cell.firstChild.innerText;
  const location = cell.children[1].innerText;
  const termDates = cell.children[2].innerText;

  let {termStart, termEnd} = calculateStartEndDate(termDates, year)

  console.log(termStart, termEnd)

  let [day, _, block] = cell.id.split("-");
  let duration = cell.getAttribute("rowspan") * HOURS_PER_BLOCK;

  let { start, end, recurrence } = calculateStartEndRecurrence(termStart, termEnd, day, block, duration);

  let data = {
    summary,
    location,
    start: {
      dateTime: "",
      timeZone: "",
    },
    end: {
      dateTime: "",
      timeZone: "",
    },
    recurrence: [""],
  };
};

const calculateStartEndDate = (datesStr, year) => {
  // Based on datesStr format: (MMM DD-MMM DD)
  let [termStart, termEnd] = datesStr.split("-");
  termStart = termStart.slice(1);
  termEnd = termEnd.slice(0, -1);

  termStart = convertStrToDate(termStart, year);
  termEnd = convertStrToDate(termEnd, year);

  return {termStart, termEnd}
}

const convertStrToDate = (dateStr, year) => {
  // Based on dateStr format: MMM DD
  return new Date(year, MONTH_KEY[dateStr.split(" ")[0]], dateStr.split(" ")[1])
}

const calculateStartEndRecurrence = (termStart, termEnd, day, block, duration) => {

};


const calculateNextDay = (afterDate, day) => {
  // Based on day format: DDD
  const copyDate = new Date(afterDate.getTime())
  return copyDate.setDate(copyDate.getDate() + + ((7 - copyDate.getDay() + DAY_KEY[day]) % 7 || 7))
}