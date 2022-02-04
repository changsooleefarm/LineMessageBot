const SSID = SpreadsheetApp.getActive().getId();

// Reply
function doPost(e) {
  let lock = LockService.getScriptLock();

  if(lock.tryLock(10 * 1000)){
  
    let event = JSON.parse(e.postData.contents).events[0];
    let eventType = event.type;
  
    let userMessage = "";
    if (eventType == "message"){
      userMessage = event.message.text;
    }
  
    this.msg = new Message();
  
    let message = "";
    if ( eventType == "follow" || userMessage == "ID") {
      message = getID(event);
    }

    this.msg.replyMessageText(message, event.replyToken);
    lock.releaseLock();
  }
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function getID(event) {
  let ss = SpreadsheetApp.openById(SSID).getSheetByName('ID');
  let userId = event.source.userId;
  let userName = this.msg.getUserName(userId);

  // Set Id to 'ID' sheet. 
  ss.appendRow([userId, userName]);
  
  let message = "Registerted!";

  return message;
}



// Push
function remind() {
  console.log("start: remind");

  let MAX_RETRY_COUNT = 3;
  for(let j = 0; j < MAX_RETRY_COUNT; j++){
    try{
      var ss = SpreadsheetApp.openById(SSID).getSheetByName('REMIND');
      var data  = ss.getDataRange().getValues();
      break;
    }catch(e){
      console.log("Error: SpreadSheet Accsess");
      if(j < MAX_RETRY_COUNT){
        continue;
      }
    }
  }

  let dayStr = ["日", "月", "火", "水", "木", "金", "土"];
  let now = new Date();
  for (let i = 2; i < data.length; i++) {
    //var [year, month, dayOfMonth, weekNum, dayOfWeek, hour, minute, message] = data[i];
    let [year, month, dayOfMonth, dayOfWeek, hour, minute, message] = data[i];

    // 本文が空の場合はスキップ
    if (message === "") {
      continue; 
      }

    if ( (year       ==  now.getFullYear()               || year       === "")
      && (month      ==  now.getMonth() + 1              || month      === "")
      && (dayOfMonth ==  now.getDate()                   || dayOfMonth === "")
      //&& (weekNum    ==  parseInt(now.getDate() / 7) + 1 || weekNum    === "")
      && (dayOfWeek  === dayStr[now.getDay()]            || dayOfWeek  === "")
      && (hour       ==  now.getHours()                  || hour       === "")
      && (minute     ==  now.getMinutes()                || minute     === "")
      ) {
        pushMessage(message);
    }
  }
  console.log("end: remind");
}


function pushMessage(message) {
  let ss = SpreadsheetApp.openById(SSID).getSheetByName('ID');
  let data = ss.getDataRange().getValues();
  let msg = new Message();
  
  let userlist = [];
  for(var i = 1; i < data.length; i++){
    userlist.push(data[i][0]);
  }
  
  msg.pushMessageMulti(message, userlist);
}
