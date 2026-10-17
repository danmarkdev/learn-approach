/* ==========================================================
   FIND THE SAME - ProfEd 1 Game Activity
   ==========================================================

   HOW TO EDIT THIS GAME (only change the CONFIG section):

   1. ACTIVITY_URL  -> paste the link to your activity questions
                       (Google Form, Google Docs, next page, etc.)
   2. LEVELS        -> one block per level.
        folder      = the folder name of the level (Level 1, Level 2...)
        main        = file name of the reference (main) picture
        choices     = the 3 choice file names
        correct     = which choice is the right answer
                      (0 = first, 1 = second, 2 = third)

   File names must match EXACTLY, including capital letters,
   spaces and the file extension. GitHub Pages is case-sensitive.
   ========================================================== */


/* ---------------------- CONFIG ---------------------- */

const ACTIVITY_URL = "https://forms.gle/PASTE-YOUR-LINK-HERE";

const LEVELS = [
    {
        folder: "Level 1",
        main: "Main Picture.jpe",
        choices: ["Choice1.jpe", "Choice2 [correct].jpg", "Choice3.jpe"],
        correct: 1
    },
    {
        folder: "Level 2",
        main: "Main Picture.jpe",
        choices: ["Choice1.jpe", "Choice2.jpe", "Choice3 [correct].jpg"],
        correct: 2
    },
    {
        folder: "Level 3",
        main: "MAIN PICTURE.jpe",
        choices: ["Choice1 [correct].jpe", "choice2.jpe", "choice3.jpe"],
        correct: 0
    },
    {
        folder: "Level 4",
        main: "MAIN PICTURE.jpe",
        choices: ["Choice1.jpe", "Choice2 [correct].jpe", "Choice3.jpe"],
        correct: 1
    }
];

// Set to true if you want the choices shuffled every time
const SHUFFLE_CHOICES = true;

/* -------------------- END CONFIG -------------------- */


let currentLevel = 0;
let score = 0;
let locked = false;
let results = [];

const els = {
    gameScreen: document.getElementById("gameScreen"),
    resultScreen: document.getElementById("resultScreen"),
    progress: document.getElementById("progress"),
    levelNumber: document.getElementById("levelNumber"),
    levelTotal: document.getElementById("levelTotal"),
    reference: document.getElementById("referenceImage"),
    choices: document.getElementById("choices"),
    feedback: document.getElementById("feedback"),
    nextBtn: document.getElementById("nextBtn"),
    score: document.getElementById("score"),
    total: document.getElementById("total"),
    finalScore: document.getElementById("finalScore"),
    finalTotal: document.getElementById("finalTotal"),
    resultMessage: document.getElementById("resultMessage"),
    activityLink: document.getElementById("activityLink"),
    restartBtn: document.getElementById("restartBtn")
};

function imagePath(folder, file) {
    return encodeURI(folder + "/" + file);
}

function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function renderProgress() {
    els.progress.innerHTML = "";
    LEVELS.forEach((_, i) => {
        const step = document.createElement("span");
        step.className = "progress-step";
        if (results[i] === true) step.classList.add("done-correct");
        else if (results[i] === false) step.classList.add("done-wrong");
        else if (i === currentLevel) step.classList.add("current");
        els.progress.appendChild(step);
    });
}

function setFeedback(text, type) {
    els.feedback.textContent = text;
    els.feedback.className = "feedback" + (type ? " " + type : "");
}

function loadLevel() {
    const level = LEVELS[currentLevel];
    locked = false;

    els.levelNumber.textContent = currentLevel + 1;
    els.levelTotal.textContent = LEVELS.length;
    els.score.textContent = score;
    els.total.textContent = LEVELS.length;

    els.reference.src = imagePath(level.folder, level.main);
    els.reference.alt = "Reference image for level " + (currentLevel + 1);

    // Pair each choice with whether it is the correct one, then shuffle
    let options = level.choices.map((file, index) => ({
        file: file,
        isCorrect: index === level.correct
    }));
    if (SHUFFLE_CHOICES) options = shuffle(options);

    els.choices.innerHTML = "";
    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice";

        const img = document.createElement("img");
        img.src = imagePath(level.folder, option.file);
        img.alt = "Choice " + String.fromCharCode(65 + index);
        img.onerror = () => {
            console.error("Image not found: " + img.src);
            img.alt = "Image not found: " + option.file;
        };

        const label = document.createElement("span");
        label.className = "choice-label";
        label.textContent = "Choice " + String.fromCharCode(65 + index);

        button.appendChild(img);
        button.appendChild(label);
        button.addEventListener("click", () => handleAnswer(button, option.isCorrect));
        els.choices.appendChild(button);
    });

    setFeedback("Select one image to answer.", "");
    els.nextBtn.disabled = true;
    els.nextBtn.textContent =
        currentLevel === LEVELS.length - 1 ? "See results" : "Next level";

    renderProgress();
}

function handleAnswer(button, isCorrect) {
    if (locked) return;
    locked = true;

    const all = els.choices.querySelectorAll(".choice");
    all.forEach(b => {
        b.disabled = true;
        if (b !== button) b.classList.add("faded");
    });

    results[currentLevel] = isCorrect;

    if (isCorrect) {
        score++;
        button.classList.add("correct");
        button.classList.remove("faded");
        setFeedback("Correct. Great job!", "good");
    } else {
        button.classList.add("wrong");
        button.classList.remove("faded");
        setFeedback("Not quite. That is not the matching image.", "bad");
    }

    els.score.textContent = score;
    els.nextBtn.disabled = false;
    renderProgress();
}

function nextLevel() {
    if (currentLevel < LEVELS.length - 1) {
        currentLevel++;
        loadLevel();
    } else {
        showResults();
    }
}

function showResults() {
    els.gameScreen.classList.add("hidden");
    els.resultScreen.classList.remove("hidden");

    els.finalScore.textContent = score;
    els.finalTotal.textContent = LEVELS.length;
    els.activityLink.href = ACTIVITY_URL;

    const ratio = score / LEVELS.length;
    if (ratio === 1) {
        els.resultMessage.textContent = "Perfect score. You matched every image correctly.";
    } else if (ratio >= 0.5) {
        els.resultMessage.textContent = "Good work. You matched most of the images correctly.";
    } else {
        els.resultMessage.textContent = "Keep practicing. You can play again to improve your score.";
    }
}

function restart() {
    currentLevel = 0;
    score = 0;
    results = [];
    els.resultScreen.classList.add("hidden");
    els.gameScreen.classList.remove("hidden");
    loadLevel();
}

els.nextBtn.addEventListener("click", nextLevel);
els.restartBtn.addEventListener("click", restart);

loadLevel();
