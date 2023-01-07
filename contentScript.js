console.log("injected script")

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const {type} = obj;

  if(type === "RETRIEVE_CLASSES") {
    retrieveClasses()
  }
})

const retrieveClasses = () => {
  const cells = document.querySelectorAll('table.time-table td.tt-registered')
  for (let cell of cells) {
    console.log(cell)
  }
}

const extractClassData = (cell) => {
  const HOURS_PER_BLOCK = 0.5
  const START_TIME = new Date(Date.UTC(0, 0, 0, 9))
  
  let data = {
    summary: "",
    start: {
      dateTime: '',
      timeZone: ''
    },
    end: {
      dateTime: '',
      timeZone: ''
    },
    location: "",
    recurrence: [
      ""
    ]
  }

  let [day, _, block] = cell.id.split("-")
  let duration = cell.getAttribute(rowspan) * HOURS_PER_BLOCK
}