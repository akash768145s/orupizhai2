const sentences = [
  {
    id: 4,
    sentence: "மறத்தில் கிளி பழத்தைக் கொத்தியது",
    errorWord: "மறத்தில்",
    correctWord: "மரத்தில்",
    errorPosition: 1,
    explanation:
      "மரத்தில் என்பது சரி. மறம் என்பதற்கு வீரம் என்பது பொருளாகும். ஆதலால்,மறத்தில் என்பது பிழை.",
  },
  {
    id: 7,
    sentence: "நாய் வேகமாக ஒடியது",
    errorWord: "ஒடியது",
    correctWord: "ஓடியது",
    errorPosition: 3,
    explanation:
      "ஓடியது என்பது சரி. ஒடி என்பதற்கு முறி என்பது பொருளாகும். ஆதலால்,ஒடியது என்பது பிழை.",
  },
  {
    id: 10,
    gameLevel: 6,
    gameComplexity: "mid",
    sentence: "மழை பெய்ததும் குலத்தில் தண்ணீர் பெருகியது",
    errorWord: "குலத்தில்",
    correctWord: "குளத்தில்",
    errorPosition: 3,
    explanation:
      "குளத்தில் என்பது சரி. குலத்தில் என்பதற்கு இனத்தில் என்று பொருளாகும். ஆதலால் குலத்தில் என்பது பிழை ",
    gameBlend: "RD, GM",
  },
];

function App() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1); // Start with -1 to show the intro screen
  const [attempts, setAttempts] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");
  const [showDialog, setShowDialog] = React.useState(false);
  const [timer, setTimer] = React.useState(0); // Timer state
  const currentSentence = sentences[currentSentenceIndex];
  const [showSecondImage, setShowSecondImage] = React.useState(false); // State to toggle second image visibility
  const [gameOver, setGameOver] = React.useState(false); // Track game over state
  const [isClickable, setIsClickable] = React.useState(true); // State to control word clickability

  React.useEffect(() => {
    let timerInterval;

    // Start timer when sentence is active
    if (currentSentenceIndex !== -1 && !gameOver) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    // Cleanup timer when the sentence is changed or game is over
    return () => clearInterval(timerInterval);
  }, [currentSentenceIndex, gameOver]);

  const handleSecondGifClick = () => {
    setShowSecondImage(true); // Show the second image when the second GIF is clicked
  };

  const handleStartGame = () => {
    setCurrentSentenceIndex(0); // Move to the first sentence
    setTimer(0); // Reset the timer when the game starts
    setGameOver(false); // Reset game over state
  };

  const handleWordClick = (word, position) => {
    if (!isClickable) return; // If the words are not clickable, do nothing

    if (attempts >= 4) {
      setFeedback("Maximum attempts reached. Moving to the next sentence.");
      return;
    }

    if (
      word === currentSentence.errorWord &&
      position === currentSentence.errorPosition
    ) {
      let points = attempts === 0 ? 10 : attempts === 1 ? 5 : 2.5;
      setScore(score + points);
      setFeedback(
        `Correct! The error was '${currentSentence.errorWord}'. It should be '${currentSentence.correctWord}'. Explanation: ${currentSentence.explanation}`
      );
      setIsClickable(false); // Disable word clicks after correct answer
      setTimeout(() => {
        setFeedback(""); // Clear feedback
        setAttempts(0);
        if (currentSentenceIndex + 1 < sentences.length) {
          setCurrentSentenceIndex(currentSentenceIndex + 1);
        } else {
          setGameOver(true); // End the game if all sentences are done
        }
        setIsClickable(true); // Re-enable clicking for the next sentence
      }, 5000); // Wait 5 seconds before moving to the next sentence
    } else {
      setFeedback("Incorrect! Try again.");
      setAttempts(attempts + 1);
    }
  };

  const renderSentence = () => {
    const words = currentSentence.sentence.split(" ");
    return words.map((word, index) => (
      <span
        key={index}
        onClick={() => isClickable && handleWordClick(word, index + 1)} // Only allow click if isClickable is true
        className={`word ${!isClickable ? "disabled" : ""}`} // Apply 'disabled' class when clicks are disabled
      >
        {word}
      </span>
    ));
  };

  const handleRestart = () => {
    setScore(0);
    setAttempts(0);
    setCurrentSentenceIndex(0); // Restart the game from the beginning
    setFeedback("");
    setGameOver(false); // Reset game over state
    setTimer(0); // Reset timer
    setShowDialog(false); // Hide any dialog boxes
  };

  return (
    <div className="app">
      {currentSentenceIndex === -1 ? (
        <React.Fragment>
          <div className="image-container">
            <img
              src="images/intro-img.png"
              alt="Game Introduction"
              className="intro-image"
            />
            <img
              src="images/game-control.gif" // Replace with your actual GIF path
              alt="Start Game"
              className="start-game-gif"
              onClick={handleStartGame} // Start the game when clicked
            />
            <img
              src="images/helper.gif" // Replace with the new GIF path
              alt="Additional Control"
              className="top-left-gif" // Class for the top left positioned GIF
              onClick={handleSecondGifClick} // Show second image on click
            />
          </div>
          {showSecondImage && (
            <div className="second-image-container">
              <button
                className="close-button"
                onClick={() => setShowSecondImage(false)}
              >
                ✖
              </button>
              <img
                src="images/helper.png" // Replace with your second image path
                alt="Second Image"
                className="second-image"
              />
            </div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="game-background">
            {currentSentenceIndex < sentences.length ? (
              <div className="sentence">{renderSentence()}</div>
            ) : null}

            <div className="text-container">{feedback}</div>

            {/* Timer Display */}
            <div className="timer" style={{ fontWeight: "bold" }}>
              {timer}
            </div>

            {gameOver && (
              <div
                className="final-score-container"
                onClick={() => window.location.reload()}
              >
                {" "}
                {/* Trigger page reload */}
                <img
                  src="images/end.png" // Replace with your final score image path
                  alt="Final Score"
                  className="final-score-image"
                />
                <div className="final-score">
                  <p>{score}</p>{" "}
                  {/* Display the score in the middle of the image */}
                </div>
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
