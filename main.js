const response = await fetch("urls.json");
const imageLinks = await response.json();

function loadGrayedOut() {
  return new Set(JSON.parse(localStorage.getItem("grayedOut") || "[]"));
}

function saveGrayedOut(grayedOut) {
  localStorage.setItem("grayedOut", JSON.stringify([...grayedOut]));
}

function createGallery() {
  const grayedOut = loadGrayedOut();
  const gallery = document.createElement("div");
  gallery.classList.add("gallery");

  for (const url of imageLinks) {
    const img = document.createElement("img");
    img.classList.add("gallery-image");
    img.src = url;

    if (grayedOut.has(url)) {
      img.classList.add("grayscale");
    }

    img.addEventListener("click", () => {
      img.classList.toggle("grayscale");
      const current = loadGrayedOut();
      if (img.classList.contains("grayscale")) {
        current.add(url);
      } else {
        current.delete(url);
      }
      saveGrayedOut(current);
    });

    gallery.appendChild(img);
  }

  document.body.appendChild(gallery);
}

function getDelay(step, totalSteps) {
  const t = step / totalSteps;
  const eased = t * t * t;
  return 50 + (420 - 50) * eased;
}

function startSpin() {
  const activeLinks = Array.from(document.querySelectorAll(".gallery-image:not(.grayscale)"))
    .map(img => img.src);

  if (activeLinks.length === 0) return;

  const finalIndex = Math.floor(Math.random() * activeLinks.length);
  const totalSteps = 20;
  tick(1, totalSteps, finalIndex, activeLinks);
}

function tick(step, totalSteps, finalIndex, activeLinks) {
  const idx = step === totalSteps
    ? finalIndex
    : Math.floor(Math.random() * activeLinks.length);

  document.getElementById("characterImage").src = activeLinks[idx];

  if (step < totalSteps) {
    setTimeout(() => tick(step + 1, totalSteps, finalIndex, activeLinks), getDelay(step, totalSteps));
  } else {
    lockIn();
  }
}

function lockIn() {
  const frame = document.getElementById("characterImage");
  frame.classList.add("shaking");
  frame.addEventListener("animationend", () => {
    frame.classList.remove("shaking");
  }, { once: true });
}

function createRandomizer() {
  const randomizer = document.createElement("div");
  randomizer.classList.add("randomizer");

  const characterImage = document.createElement("img");
  characterImage.id = "characterImage";
  characterImage.src = imageLinks[0];

  const randomizeButton = document.createElement("button");
  randomizeButton.textContent = "RANDOMIZE!";
  randomizeButton.addEventListener("click", startSpin);

  randomizer.appendChild(characterImage);
  randomizer.appendChild(randomizeButton);
  document.body.appendChild(randomizer);
}

createGallery();
createRandomizer();