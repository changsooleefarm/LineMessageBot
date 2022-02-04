class Error{
  constructor(){
  }

  messageError(e){

    let msg = Utilities.formatString("【エラーが発生しました】\nメッセージ: %s\n",e.message);

    if(e.fileName && e){
       msg += Utilities.formatString("FileName: %s\nLineNumber: %s\n", e.fileName, e.lineNumber)
    }

    if(e.stack){
      msg += Utilities.formatString("----- StackTrace -----\n%s\n--------------------\n",e.stack)
    }

    console.log(msg);
  }
}