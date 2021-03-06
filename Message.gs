const LINE_TOKEN = "";//test

class Message {
  constructor(){
    this.message = '';
    this.token = '';
    this.pushRequest = "https://api.line.me/v2/bot/message/push";
    this.pushMulticast = "https://api.line.me/v2/bot/message/multicast";
    this.replyRequest = "https://api.line.me/v2/bot/message/reply";
    this.profileRequest = "https://api.line.me/v2/bot/profile/";
    this.e = new Error();
  }

  setToken(token){
    this.token = token;
    return true;
  }

  sendMessage(httpType,jsonType){
    try{
      UrlFetchApp.fetch(httpType, {
       'headers':{
         'Content-Type': 'application/json; charset=UTF-8',
         'Authorization': 'Bearer ' + LINE_TOKEN,
        },
        'method': 'post',
        'muteHttpExceptions':true,
        'payload': jsonType
      })
    }catch(e){
      this.e.messageError(e);
    }
   }

  replyMessageText(value,replyToken) {
    let jsonType = (JSON.stringify({
        'replyToken': replyToken ,
        'messages': [{
          'type' :'text',
          'text' : value,
        }]
      })
    );

    this.sendMessage(this.replyRequest, jsonType);
  }

  pushMessageText(message,userId) {
    let jsonType = (JSON.stringify({
        'to': userId,
        'messages':[{
          'type':'text',
          'text': message,
        }]
      })
    );

    this.sendMessage(this.pushRequest, jsonType);
  }

  pushMessageMulti(message, userIdList) {
    let jsonType = (JSON.stringify({
        'to': userIdList,
        'messages':[{
          'type':'text',
          'text': message,
        }]
      })
    );

    this.sendMessage(this.pushMulticast, jsonType);
  }

  getUserName(id){
    try{
      console.log("Start: getUserName");
      let res = UrlFetchApp.fetch( this.profileRequest +  id , {
       'headers':{
         'Content-Type': 'application/json; charset=UTF-8',
         'Authorization': 'Bearer ' + LINE_TOKEN,
        }
      });
      console.log("req =%s",res);

      res = JSON.parse(res.getContentText());
      console.log(res);

      let userId = res["userId"];//????????????ID
      let userName = res["displayName"];//????????????????????????

      // ?????????????????????????????????????????????????????????????????????
      //let pictureUrl = res["pictureUrl"];//???????????????????????????URL
      //let language = res["language"];//?????????????????????
      //let statusMessage = res["statusMessage"];//?????????????????????????????????????????????

      console.log("userId= %s\nuserName= %s\n",userId, userName);
      console.log("End: getUserName");
      return userName;
    }catch(e){
      console.log("Error: getUserName");
      this.e.messageError(e);
      return false;
    }
  }
}