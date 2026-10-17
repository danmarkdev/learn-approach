
console.log("from script file");

const pictures = [
    "/IMAGES/1st outline.png",
    "/IMAGES/1st darkened.png",
    "/IMAGES/1st dolored.png"
];

let score = 0;
let answer = 0;
let locked = false;

function newRound() {
    const available = pictures.filter(p => p.trim() !== "");

    if (available.length < 3) {
        document.getElementById("message").textContent = "/IMAGES/1st outline.png"
            "/IMAGES/2nd outline.png", "/IMAGES/3rd outline.png" ;
        return;
    }

    locked = false;
    document.getElementById("message").textContent =
        "Choose the matching image!";

    const target = available[
        Math.floor(Math.random() * available.length)
    ];

    let options = [target];

    while (options.length < 3) {
        const image = available[
            Math.floor(Math.random() * available.length)
        ];

        if (!options.includes(image)) {
            options.push(image);
        }
    }

    options.sort(() => Math.random() - 0.5);
    answer = options.indexOf(target);

    document.getElementById("target").src = target;

    const choices = document.getElementById("choices");
    choices.innerHTML = "";

    options.forEach((image, index) => {
        const img = document.createElement("img");
        img.src = image;
        img.className = "choice";
        img.alt = "Choice " + (index + 1);

        img.onclick = () => {
            if (locked) return;
            locked = true;

            if (index === answer) {
                score++;
                document.getElementById("message").textContent =
                    "✅ CORRECT! NICE JOB!";
            } else {
                document.getElementById("message").textContent =
                    "❌ WRONG! Try the next round!";
            }

            document.getElementById("score").textContent = score;
        };

        choices.appendChild(img);
    });
}

newRound();
