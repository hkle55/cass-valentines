// Images
const startPhoto = "assests/start.png";

const noPhotos = [
  "assests/IMG_1705.png",
  "assests/IMG_0599.png",
  "assests/IMG_2518.jpeg",
  "assests/IMG_9382.jpeg",
  "assests/DSCF1216.jpeg",
];

const yesGif = "assests/cat-clap.gif";

// Text
const noMessages = [
  "Look how whimsy we are together though…",
  "Be deadass… we're cute this is us at longwood gardens",
  "like come on ive been in love with you forever",
  "Okay this is kinda crazy its gotten this far look at us.",
  "im gonna cry",
  "You really wanna say no to WHIMSY??",
  "Last chance before the button disappears.",
  "Alright… I’m gonna make it IMPOSSIBLE to say no.",
];

let noCount = 0;
let yesScale = 1;
let noScale = 1;

const imgEl = document.querySelector("#mainImage");
const questionEl = document.querySelector("#questionText");
const subEl = document.querySelector("#subText");
const yesBtn = document.querySelector("#yesBtn");
const noBtn = document.querySelector("#noBtn");
const btnRow = document.querySelector("#btnRow");
const cheerAudio = document.querySelector("#cheerAudio");

// Start state
imgEl.src = startPhoto;

// Utility: clamp
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Runaway settings
const RUNAWAY_AFTER = 8; // after this many No clicks, it starts running away
let runawayEnabled = false;

function moveNoButtonRandomly() {
  // Make No position absolute relative to btnRow
  noBtn.style.position = "absolute";

  const pad = 6;
  const rowRect = btnRow.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = rowRect.width - btnRect.width - pad;
  const maxY = rowRect.height - btnRect.height - pad;

  const x = Math.random() * Math.max(maxX, pad);
  const y = Math.random() * Math.max(maxY, pad);

  noBtn.style.left = `${clamp(x, pad, maxX)}px`;
  noBtn.style.top = `${clamp(y, pad, maxY)}px`;
}

function enableRunaway() {
  runawayEnabled = true;
  subEl.textContent = "The No button is getting nervous…";

  // Teleport on hover / touch
  noBtn.addEventListener("mouseenter", () => {
    moveNoButtonRandomly();
  });

  // On mobile, touchstart makes it jump
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButtonRandomly();
  }, { passive: false });
}

noBtn.addEventListener("click", () => {
  // Swap photo (cycle through all photos)
  const idx = noCount % noPhotos.length;
  imgEl.src = noPhotos[idx];

  // Change message (clamp to last message)
  const msgIdx = clamp(noCount, 0, noMessages.length - 1);
  questionEl.textContent = noMessages[msgIdx];

  noCount++;

  // Scale buttons
  yesScale = clamp(yesScale + 0.22, 1, 4.0);
  noScale = clamp(noScale - 0.10, 0.25, 1);

  yesBtn.style.transform = `scale(${yesScale})`;
  noBtn.style.transform = `scale(${noScale})`;

  // Hide No button when it gets too small
  if (noScale <= 0.3) {
    noBtn.style.display = "none";
  }

  // Add pulse once yes is getting big
  if (yesScale >= 1.8) yesBtn.classList.add("pulse");

  // Enable runaway after a threshold
  if (!runawayEnabled && noCount >= RUNAWAY_AFTER) {
    enableRunaway();
    moveNoButtonRandomly();
  } else if (runawayEnabled) {
    // On click it can also jump, just to be annoying
    moveNoButtonRandomly();
  }
});

yesBtn.addEventListener("click", () => {
  // Swap to clapping cat
  imgEl.src = yesGif;

  questionEl.textContent = "THANK GAWD I love you 😤";
  subEl.textContent = "Happy Valentine's Day baby";

  // Hide both buttons
  noBtn.style.display = "none";
  yesBtn.style.display = "none";

  // Confetti
  if (typeof confetti === "function") {
    confetti({ particleCount: 160, spread: 70, origin: { y: 0.65 } });
    setTimeout(() => confetti({ particleCount: 120, spread: 100, origin: { y: 0.7 } }), 250);
  }

  
});
