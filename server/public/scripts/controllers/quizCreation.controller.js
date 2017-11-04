myApp.controller('QuizCreation', function (ModuleCreation) {
    // console.log('in home controller');

    // Code Readability notes:
    // q = question
    // a = answer
    // sa = short answer
    // mc = multiple choice
    // ca = correct answer (for multiple choice)
    // e = essay (like SA, but longer char limit)

    const vm = this;

    vm.quiz = ModuleCreation.quiz;
    vm.name = ModuleCreation.name;
    vm.currentQType = ModuleCreation.currentQType;
    vm.questions = ModuleCreation.questions; // holds questions to push into quiz
    vm.currentMCQ = ModuleCreation.currentMCQ; // MC Question
    vm.currentMCA1 = ModuleCreation.currentMCA1; // MC Answers 1-4 below
    vm.currentMCA2 = ModuleCreation.currentMCA2;
    vm.currentMCA3 = ModuleCreation.currentMCA3;
    vm.currentMCA4 = ModuleCreation.currentMCA4;
    vm.currentMCCA = ModuleCreation.currentMCAA; // MCCA = Multiple Choice Correct Answer
    vm.currentSAQ = ModuleCreation.currentSAQ; // SA Question
    vm.currentSAA = ModuleCreation.currentSAA; // SA Answer/hints to grade on
    vm.currentEQ = ModuleCreation.currentEQ; // Essay Question/Topic
    vm.currentEA = ModuleCreation.currentEA; // Essay Answer/hints to grade on

    // pushes MC Q into Q array
    vm.pushMCQ = ModuleCreation.pushMCQ;
    // end pushMCQ function

    // pushes SA Q into Q array
    vm.pushSAQ = ModuleCreation.pushSAQ; 
    // end pushSAQ function

    // pushes Essay question into Q array
    vm.pushEssayQ = ModuleCreation.pushEssayQ; // end pushEssayQ function

    // // creates quiz object using name and questions array.
    // // POST calls to router with quiz object. Response logged and quiz array reset to 0;
    // vm.pushToQuiz = ModuleCreation.pushToQuiz; // end pushToQuiz function

    // confirm functionality for submit of form
    vm.showConfirm = ModuleCreation.showConfirm;
});