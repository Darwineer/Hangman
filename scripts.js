  $(document).ready(function() {

    $(document).on("keypress", "form", function(event) {
    return event.keyCode != 13;
    });

    function getPuzzle() {
      Math.floor((Math.random() * 10) + 1);
      var puzzles = ['Meteor','JavaScript','JQuery','Programming','Object',
      'Development','Software','Engineering','Microservices','Interview'];
      var index = Math.floor((Math.random() * 10));
      return puzzles[index];

    }

    function stringToCharArray(str) {
      return Array.from(str);
    }

    function displayPuzzle(puzz) {
      $("#puzzle").empty();
      var i = 0;
      for (i; i<puzz.length; i++){
        $("#puzzle").append("<a>" + puzz[i]  + "&nbsp; </a>");
      }
    }
    //empty gallows tag and repopulate it with the correct image
    function buildGallows(wrongLetters) {
      $("#gallows").empty();
      $("#gallows").append("<pic> <img src = \"gallows" + wrongLetters + ".png\"> </pic>");
    }
    function checkInputIsLetter(input) {
      if ((input.search(/^[A-Z]$/)==-1)&&(input.search(/^[a-z]$/)==-1)) {
        return false;
      }
      else{
        return true;
      }
    }
    function alreadyGuessed(letter){
      var i = 0;
      var isRepeat = 0;
      var oldGuess, newGuess;

      for (i; i<previousGuesses.length; i++){
        newGuess = standardizeCharID(letter.charCodeAt(0));
        oldGuess = standardizeCharID(previousGuesses[i].charCodeAt(0));
        if (newGuess == oldGuess){
          isRepeat++;
        }
      }
      if (isRepeat > 0){
        return true;
      }
      else {
        return false;
      }
    }
    /*given a charID (char as int), converts to uppercase if lowercase,
    returns the same argument it was passed otherwise*/
    function standardizeCharID(charID){
      if (charID>96){
        return charID - 32;
      }
      else {
        return charID;
      }
    }
    /*checks letter against each address of the answer array and shows the letter
    in display array if correct, returns an int 'correct' for the number of times
    that letter appears*/
    function checkLetter(puzzleAnswer, puzzleDisplay, letter) {
      var i = 0;
      var correct = 0;
      var answerLetter, guessedLetter;

      for (i; i<puzzleDisplay.length; i++){
        answerLetter = standardizeCharID(puzzleAnswer[i].charCodeAt(0));
        guessedLetter = standardizeCharID(letter.charCodeAt(0));
        letter = String.fromCharCode(guessedLetter);
        if (answerLetter == guessedLetter) {
          puzzleDisplay[i]=letter;
          correct++;
        }
      }
      return correct;
    }

    function displayStats(){
      $("#score1").empty();
      $("#score1").append(gamesWon);
      $("#score2").empty();
      $("#score2").append(gamesLost);
    }

    function resetPuzzle(){
      buildGallows(0);
      puzzle = getPuzzle();
      $("#incorrectLetters").empty()
      puzzleAsCharArray = stringToCharArray(puzzle);
      puzzleDisplayArray = puzzleAsCharArray.slice();
      previousGuesses = [];
      wrongLetters = 0;
      totalCorrectGuesses = 0;
      repeat = false;

      i = 0;
      for (i; i<puzzleDisplayArray.length; i++) {
        puzzleDisplayArray[i] = "_";
      }
      displayPuzzle(puzzleDisplayArray);
    }

    //the word to be guessed as a string
    var puzzle = getPuzzle();
    //the puzzle represented as an array of characters: the answer array
    var puzzleAsCharArray = stringToCharArray(puzzle);
    //set the display array equal to the answer array to initialize
    var puzzleDisplayArray = puzzleAsCharArray.slice();
    var previousGuesses = [];
    var guessedLetter;
    var wrongLetters = 0;
    var totalCorrectGuesses = 0;
    var gamesWon = 0;
    var gamesLost = 0;
    var repeat = false;
    var gameOver = false;
    var i = 0;

    //overwrite the letters of the display array to underscores
    for (i; i<puzzleDisplayArray.length; i++) {
      puzzleDisplayArray[i] = "_";
    }

    //print the display array
    displayPuzzle(puzzleDisplayArray);

    $("#reset").click(function() {
      resetPuzzle();
    });

    $("#submit").click(function() {

      $("#message").empty();

      if ((wrongLetters<10)&&(totalCorrectGuesses<puzzleAsCharArray.length)){

        guessedLetter = $("#letterEntry").val();
        $('input:text').val('');
        if (previousGuesses.length > 0) {
          var repeat = alreadyGuessed(guessedLetter);
        }

        if (((checkInputIsLetter(guessedLetter)) && (!repeat)) && (!gameOver)) {
          var correctGuesses = checkLetter(puzzleAsCharArray, puzzleDisplayArray, guessedLetter);
          if (correctGuesses==0){
            wrongLetters++;
            $("#message").append("<div> The letter " + guessedLetter + " does not appear in the puzzle </div>");
            previousGuesses.push(guessedLetter);
            $("#incorrectLetters").append(guessedLetter + "&nbsp;");
            buildGallows(wrongLetters);
            if(wrongLetters>9){
              $("#message").append("<div> Oh no! You've lost! </div>");
              gamesLost++;
              gameover = true;
              displayStats();
            }
          }
          else{
            $("#message").append("<div> The letter " + guessedLetter + " appears " + correctGuesses + " time(s)! </div>");
            totalCorrectGuesses += correctGuesses;
            previousGuesses.push(guessedLetter);
            if (totalCorrectGuesses==puzzleAsCharArray.length){
              $("#message").append("<div> Congratulations! You've won! </div>");
              gamesWon++;
              gameover = true;
              displayStats();
            }

          }

          displayPuzzle(puzzleDisplayArray);
          }

        else if (repeat) {
          $("#message").append("<div> You have already guessed that letter! </div>");
        }

        else{
          $("#message").append("<div> That is not a valid letter. </div>");
        }
      }
    });
});
