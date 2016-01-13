var exports = module.exports;

var records = [
    { Qid: 1,
      QString: "Lec1SelfTest1",
      answerOp: 1,
      resOption: [
          "Incorrect, the *heights* of the bars encode *quantitative* data about *sales in dollars*. Please review the information about quantitative data.", "Incorrect, the *colors* of the bars encode *categorical* data identifying which sales are direct and which sales are indirect. Please review the information about categorical data", "Correct. The *heights* of the bars encode *quantitative* data about *sales in dollars*", "Incorrect. Please review the information about quantitative and categorical data." ]
    },
      //resOption is ordered as per the order of the questions
      //displayed
];

exports.findAns = function(qstring, option) {
    console.log("string is" + qstring)
    for (var i = 0, len = records.length; i < len; i++) {
        var record = records[i];
        if (record.QString == qstring) {
            console.log("string matched")
            for(var j=0; j < record.resOption.length; j++){
                if(option == "option" + (j+1)){
                    return record.resOption[j];
                }// string matches the correct answer
            }
        }
    }
    return null;
}       

