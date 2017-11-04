myApp.controller('QuizCreation', function ($http, $scope, $mdDialog) {
    // console.log('in home controller');

    // Code Readability notes:
    // q = question
    // a = answer
    // sa = short answer
    // mc = multiple choice
    // ca = correct answer (for multiple choice)
    // e = essay (like SA, but longer char limit)

    const vm = this;

    vm.quiz = {data: []};
    vm.name = '';
    vm.currentQType = '';
    vm.questions = []; // holds questions to push into quiz
    vm.currentMCQ = ''; // MC Question
    vm.currentMCA1 = ''; // MC Answers 1-4 below
    vm.currentMCA2 = '';
    vm.currentMCA3 = '';
    vm.currentMCA4 = '';
    vm.currentMCCA = ''; // MCCA = Multiple Choice Correct Answer
    vm.currentSAQ = ''; // SA Question
    vm.currentSAA = ''; // SA Answer/hints to grade on
    vm.currentEQ = ''; // Essay Question/Topic
    vm.currentEA = ''; // Essay Answer/hints to grade on

    // establishes structure for multiple choice question to be inserted into questions array
    class MCQuestion {
        constructor (q, a1, a2, a3, a4, ca){
            this.q = q;
            this.a1 = a1;
            this.a2 = a2;
            this.a3 = a3;
            this.a4 = a4;
            this.ca = ca; // ca = correct answer
            this.type = 'mc';
        }
    } // end MCQuestion class

    // pushes MC Q into Q array
    vm.pushMCQ = (q, a1, a2, a3, a4, ca) => {
        vm.newMCQ = new MCQuestion(q, a1, a2, a3, a4, ca);
        vm.questions.push(vm.newMCQ);
        console.log('loggin vm.newMCQ in pushMCQuestion -> ', vm.newMCQ);

        // clear the form for the next questions submission
        vm.currentMCQ = '';
        vm.currentMCA1 = '';
        vm.currentMCA2 = '';
        vm.currentMCA3 = '';
        vm.currentMCA4 = '';
        vm.currentMCCA = '';
    }; // end pushMCQ function

    // establishes structure for SA Q to be inserted into Q array
    class ShortAnsQuestion {
        constructor (q, a) { // q = question, a = answer
            this.q = q;
            this.a = a;
            this.type = 'sa'; // sa = short answer
        }
    } // end ShortAnsQuestion Class

    // pushes SA Q into Q array
    vm.pushSAQ = (q, a) => {
        vm.newSAQuestion = new ShortAnsQuestion(q, a);
        vm.questions.push(vm.newSAQuestion);
        console.log('logging vm.newSAQuestion in pushShortAnsQuestion -> ', vm.newSAQuestion);

        // clear SA fields
        vm.currentSAQ = ''; // SA Question
        vm.currentSAA = ''; // SA Answer/hints to grade on
    }; // end pushSAQ function

    // establishes structure for essay class Qs to be pushed into Q array
    class Essay {
        constructor (q, a) {
            this.q = q;
            this.a = a;
            this.type = 'essay';
        }
    } // end Essay class

    // pushes Essay question into Q array
    vm.pushEssayQ = (q, a) => {
        vm.newEQ = new Essay(q, a);
        vm.questions.push(vm.newEQ);
        console.log('logging vm.newEQ in pushEssayQ -> ', vm.newEQ);

        // clear Essay fields
        vm.currentEQ = ''; // Essay Question/Topic
        vm.currentEA = ''; // Essay Answer/hints to grade on
    }; // end pushEssayQ function

    // creates overarching 'quiz' item which holds name and questions.
    // entire 'quiz'will be sent to backend for insertion into DB.
    class Quiz {
        constructor (name, q){
            this.name = name; // name is to be a string
            this.questions = q; // questions will be a class of either multiple choice, short answer, or essay. 
                                        // questions will be an array of objects of the above questions.
        }
    } // end Quiz class

    // creates quiz object using name and questions array.
    // POST calls to router with quiz object. Response logged and quiz array reset to 0;
    vm.pushToQuiz = (name, q) => {
        vm.newQuiz = new Quiz(name, q);
        vm.quiz.data.push(vm.newQuiz);
        console.log('logging vm.quiz in pushToquiz => ', vm.quiz);
        return $http.post('/quizGeneration', vm.quiz)
        .then((response)=>{
            console.log('Posted');
            vm.quiz.data.length = 0; // empties quiz item
            vm.name = '';
        })
        .catch((e)=>{
            console.log('logging catch error in vm.pushToQuiz', e);
        });
    }; // end pushToQuiz function

    // confirm functionality for submit of form
    vm.showConfirm = function(ev) {
        vm.status = ''; // status of submission to log if submission is declined.
        var confirm = $mdDialog.confirm()
              .title('Confirm Quiz Submission')
              .textContent('Do you wish to submit this quiz? Quizzes are unable to be edited after submission.')
              .ariaLabel('Confirm you wish to submit the quiz.')
              .targetEvent(ev)
              .ok('YES')
              .cancel('NO');
        $mdDialog.show(confirm).then(function() { // following script runs if 'yes' is selected.
          vm.status = 'Form submitted.';
          vm.pushToQuiz(vm.name, vm.questions);
        }, function() { // status updated and logged if form is not submitted.
          vm.status = 'Form not submitted.'; 
          console.log(vm.status);
          
        });
      };
});