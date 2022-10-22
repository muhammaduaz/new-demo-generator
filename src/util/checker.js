/* 
The following is a list of checks to be performed when the csv template is loaded. 

1. Event ID is array position - 1
2. pos[1] is track or identify or page or group
3. If pos[1] == track, pos[2] is not blank
4. pos[4] between 0 and 100
5. pos[7] is blank or 32 characters long

6. pos[8] to pos[max]
  a. must contain one ":"
  b. if [, must have ]
  c. if {, must have } 
  d. if {, must have dependency with an array
  e. if *, must have dependency 
  d. if # exists, only 
*/

const checkEventId = (arr, i) => {
  return ((parseInt(arr[0]) + 1) === i) ? true : false;
}
const checkEventIdOrder = (allArr) => {
  let result = true;
  for (let i = 2; i < allArr.length -1; i++) {
    if ((parseInt(allArr[i][0]) + 1 !== (parseInt(allArr[i+1][0])))) {
      result = false;
    }
  }
  return result;
}

const checkEventType = (arr) => {
  let result = true;
  switch (arr[1]) {
    case "track": result = true;
    case "page": result = true;
    case "group": result = true;
    case "identify": result = true;
        break;
    default:
        result = false;
  }
  return result;
}

const checkEventName = (arr) => {
  let result = true;
  if (arr[1] === "track") {
    if (!arr[2]) {
      result = false;
    }
  }
  return result;
} 

const checkChanceOfHappening = (arr) => {
  return ((parseInt(arr[4]) <= 100) || (parseInt(arr[4]) >= 0)) ? true : false;
}
const checkOptionalWriteKey = (arr) => {
  return ((arr[7].length === 32) || (!(arr[7]))) ? true : false;
}
const checkProperties  = (arr) => {
  let errors = []
  for (let i = 8; i < arr.length-1; i++) {
    if (arr[i]) {
      // must contain one ":"
      if ((arr[i].match(/:/g)||[]).length !== 1) errors.push(`Property Error on Event ID: ${arr[0]}, missing or extra colon`);

      // if [, must have ]
      // if {, must have } 
      if (arr[i].split("[").length === 2) {
        if (arr[i].split("]").length !==2 ) errors.push (`Property Error on Event ID: ${arr[0]}, extra bracket`);
      }
      if (arr[i].split("]").length === 2) {
        if (arr[i].split("[").length !==2 ) errors.push (`Property Error on Event ID: ${arr[0]}, extra bracket`);
      }
      if (arr[i].split("{").length === 2) {
        if (arr[i].split("}").length !==2 ) errors.push (`Property Error on Event ID: ${arr[0]}, extra bracket`);
        // if {, must have dependency with an array
        if (!arr[3].includes("[")) errors.push (`Property Error on Event ID: ${arr[0]}, bracket notation requires multiple dependency`);

      }
      if (arr[i].split("}").length === 2) {
        if (arr[i].split("{").length !==2 ) errors.push (`Property Error on Event ID: ${arr[0]}, extra bracket`);
      }

      // if *, must have dependency 
      if (arr[i].split("*").length === 2) {
        if (!arr[3]) errors.push (`Property Error on Event ID: ${arr[0]}, * inheritance requires dependency`);
      }
    }
  }

  return errors
}

export const checkSyntax = (allArr, setErrors) => {
  let errors = [];
  if (!checkEventIdOrder(allArr)) {
    errors.push('EventID is not in sequential order')
  }

  for (let i = 2; i < allArr.length; i++) {
    if (!checkEventId(allArr[i], i)) errors.push(`Potential EventID error on ID: ${allArr[i][0]}, not row + 1`);
    if (!checkEventType(allArr[i])) errors.push(`Event Type error on ID: ${allArr[i][0]}, not track, page, identify or group`);
    if (!checkEventName(allArr[i])) errors.push(`Event Name error on ID: ${allArr[i][0]}, track event needs Event Name`);
    if (!checkChanceOfHappening(allArr[i])) errors.push(`Chance of happening error on ID: ${allArr[i][0]}, should be between 0 and 100`);
    if (!checkOptionalWriteKey(allArr[i])) errors.push(`Optional Write Key error on ID: ${allArr[i][0]}, should be blank or valid write key`);
    if (checkProperties(allArr[i]).length > 0) { errors.push(checkProperties(allArr[i]))}
  }
  setErrors(errors)
  return errors
}