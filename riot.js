const URL = "https://valorant-api.com/v1/agents";
const charactersEl = document.getElementById("characters");
const characterSelect = document.getElementById("character-select");
const container = document.querySelector(".container");
let characters;
let previousIndex;

(async function fetchCharacters() {
    try {
        const res = await fetch(URL).then((json) => json.json());

        updateCharacters(res.data);

        return res.data;
    } catch (error) {
        console.log(error);
    }
})();

function updateCharacters(data) {
    characters = data.filter((char) => char.isPlayableCharacter);
    characterSelect.innerHTML = characters
        .map((char, i) => {
            return `<div class="${i === 0 && "active"}" onclick="setActive(${i})">
      <img src="${char.displayIcon}" alt="${char.displayName}" />
    </div>`;
        })
        .join("");

    setActive(0);
}

function setActive(index) {
    removeAllActive();
    characterSelect.children[index].classList.add("active");

    updateAgent(index);
    changeWallpaperPosition(index);
}

function removeAllActive() {
    for (let i = 0; i < characterSelect.children.length; i++) {
        characterSelect.children[i].classList.remove("active");
    }
}

function updateAgent(index) {
    charactersEl.innerHTML = characters
        .map((char, i) => {
            return `
       <div class="portrait-container">
      <img src="${characters[i].fullPortrait}" alt="${characters[i].displayName}" />
      </div>
      `;
        })
        .join("");

    document.querySelector(".character-name").innerHTML =
        characters[index].displayName;

    document.querySelector(".character-background").innerHTML = `
    <img src="${characters[index].background}" alt="${characters[index].displayName}"/>
  `;

    const info = document.querySelector(".info");

    const keybinds = ["C", "Q", "E", "X"];

    info.innerHTML = `
  <p class="info-p">${characters[index].description}</p>
  <div class="abilities"></div>
  `;

    document.querySelector(".abilities").innerHTML = characters[index].abilities
        .map((ability, i) => {
            if(i === 4) return;

            return ` 
    <div class="ability">
      <div class="keybind">
        ${keybinds[i]}
      </div>
      
      <div class="ability-image">
        <img src="${ability.displayIcon}" alt="${ability.displayName}"/>
      </div>
    </div>`;
        })
        .join("");

    document.body.style.setProperty(
        "--background-character",
        `#${characters[index].backgroundGradientColors[0].slice(0, 6)}`
    );
}

function changeWallpaperPosition(index) {
    charactersEl.classList.add("animate");
    charactersEl.style.left = `-${index * 100}vw`;

    setTimeout(() => {
        charactersEl.classList.remove("animate");

        for (let i = 0; i < charactersEl.children.length; i++) {
            if (i !== index) continue;

            charactersEl.children[index].style.setProperty(
                "-webkit-filter",
                `drop-shadow(20px 10px 0 #${characters[
                    index
                    ].backgroundGradientColors[0].slice(0, 6)})
         `
            );

            container.style.setProperty(
                "--background",
                `linear-gradient(45deg, #${characters[
                    index
                    ].backgroundGradientColors[0].slice(0, 6)} 0%, #${characters[
                    index
                    ].backgroundGradientColors[1].slice(0, 6)} 30%, #${characters[
                    index
                    ].backgroundGradientColors[2].slice(0, 6)} 65%, #${characters[
                    index
                    ].backgroundGradientColors[3].slice(0, 6)} 100%)`
            );

            break;
        }
    }, calculateAnimationDuration(index));
}

function calculateAnimationDuration(index) {
    let miliseconds;

    if (!previousIndex) {
        previousIndex = index;
        miliseconds = 400;
        return miliseconds;
    }

    if (index === 1) {
        miliseconds = 400;
        previousIndex = index;
        return miliseconds;
    }

    if (previousIndex / index >= 0 && previousIndex / index < 4) {
        miliseconds = 400;
    } else if (previousIndex / index > 4 && previousIndex / index < 8) {
        miliseconds = 800;
    } else if (previousIndex / index > 8) {
        miliseconds = 1200;
    }

    previousIndex = index;
    return miliseconds;
}
