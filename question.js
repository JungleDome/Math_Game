module.exports = function(args) {
    if (args.questionID) {var questionID = args.questionID;}
    else {console.trace('No question ID provided.');}

    if (args.questionFileName) {var questionFileName = 'assets/questions/' + args.questionFileName;}
    else {console.trace('No question file name provided.');}

    if (args.questionAnswer) {var questionAnswer = args.questionAnswer;}
    else {console.trace('No question answer provided.');}

    if (args.questionChoices) {var questionChoices = args.questionChoices;}
    else {var questionChoices = null;}

    return {
        questionID:questionID,
        questionFileName:questionFileName,
        questionAnswer:questionAnswer,
        questionChoices:questionChoices,

        checkAnswer: function(userAnswer) {
            if (this.questionAnswer==userAnswer) {
                return true
            } else {
                return false;
            }
        }
    }

    function LIB_shuffle(a) {
        for (var i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }
};