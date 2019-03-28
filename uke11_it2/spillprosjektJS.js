var text = document.getElementById("text");
var buttonBox = document.getElementById("buttonBox");
var input = document.getElementById("input");
var soundTxt = document.getElementById("soundTxt");
var audio = document.getElementById("audio");
//Variabel for navnet du taster inn i inputen
var characterName;



//Denne funksjonen gjør slik at man kan klikke "enter"-knappen for å fortsette spillet. Deretter fjerner jeg input elementet, fordi det skal ikke lenger være der. Samtidig fjerner jeg soundTxt.
input.onkeypress = function (event) {
    console.log(input.value);
    if (event.key === "Enter" || event.keyCode === 13) {
        characterName = input.value;
        input.parentNode.removeChild(input);
        soundTxt.parentNode.removeChild(soundTxt);
        advanceTo(scenario.two)
    }
};

//Dette endrer teksten og putter inn navnet du skrev inn i inputfeltet

var endreText = function (ord) {
    text.innerHTML = ord.replace("Karakter navn", characterName);
};

//Deretter må vi se på hvor mange valgmuligheter vi har, og lager nok buttons til disse valgmulighetene
var endreButtons = function (buttonList) {
    buttonBox.innerHTML = "";
    for (var i = 0; i < buttonList.length; i++) {
        buttonBox.innerHTML += "<button onClick="+buttonList[i][1]+">" + buttonList[i][0] + "</button>"
    }
};

//Så må vi få spillet til å gå videre, og da bruker jeg "advanceTo"
var advanceTo = function (s) {
    endreText(s.text);
    endreButtons(s.buttons);
};



//Til sist skal jeg lage objektet som inneholder hvert eneste scenario, desto flere scenarioer jeg lager, desto flere valgmuligheter får jeg
var scenario = {
    one: {
        text: "You find yourself covered in blood with a massive headache. You have no clue of what has happened. When you sit up and turn around you see a bloody axe and some bloody trails. These trails lead straight into the dark forest ahead.",
    },
    two: {
        text: "Karakter navn, do you want to proceed into the forest following the trails?",
        buttons: [["Run away from the forest", "advanceTo(scenario.three)"], ["Follow the bloody trails", "advanceTo(scenario.four)"]]
    },
    three: {
        text: "You run away from the forest, desperately trying to figure out what happened. Suddenly a pack of wild dogs seems to caught your smell, and your only option is to run back into the forest.",
        buttons: [["Continue", "advanceTo(scenario.four)"]]
    },
    four: {
        text: "The dark forest overwhelms you as you enter its territory. You start slowing down, trying to catch your breath. As you turn around a scream fills the forest.",
        buttons: [["Follow the scream", "advanceTo(scenario.five_2)"], ["Follow the bloody trails", "advanceTo(scenario.five)"]]
    },
    five: {
        text: "You follow the bloody trails deeper into the forest. A red cabin appears in the distance, it's hidden in a dense forest landscape. The trails lead directly at it and as you get closer you see that the door is open.",
        buttons: [["Enter the cabin without thinking", "advanceTo(scenario.six)"], ["Approach the cabin slowly", "advanceTo(scenario.six_2)"]]
    },
    five_2: {
        text: "The scream led you to a blue cabin. The blue cabin looks new... Someone's probably inside. You choose to approach the cabin slowly. ",
        buttons: [["Continue approaching the cabin", "advanceTo(scenario.six_2)"]]
    },
    six: {
        text: "The stench of rotten blood fills your nose. The door at the other end of the hallway leads outside, that door is open as well. It doesn't seem like there are other rooms than this hallway... ",
        buttons: [["Go out through the door at the end of the hallway", "advanceTo(scenario.seven)"]]
    },
    six_2: {
        text: "As you slowly approach the cabin the stench of rotten blood fills your nose. You look inside. The door at the other end of the hallway leads outside, that door is open as well. It doesn't seem like there are other rooms than this hallway... ",
        buttons: [["Go out through the door at the end of the hallway", "advanceTo(scenario.seven)"]]
    },
    seven: {
        text: "As you step inside the hallway your surroundings change. Everything blurs out and your head starts to ache again. Loud whispers tears your head and  I later woke up with a terrible headache outside the forest. To be continued..."
    }
};
//Denne koden starter spillet
advanceTo(scenario.one);
audio.autoplay = true;
audio.loop = true;
audio.play();

