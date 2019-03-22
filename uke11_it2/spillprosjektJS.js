var images = document.getElementById("images");
var text = document.getElementById("text");
var buttonBox = document.getElementById("buttonBox");
var input = document.getElementById("input");
//Variabel for navnet du taster inn i inputen
var characterName;

input.onkeypress = function (event) {
    console.log(input.value);
    if (event.key === "Enter" || event.keyCode === 13) {
        characterName = input.value;
        input.parentNode.removeChild(input);
        advanceTo(scenario.two)
    }
};

//Dette endrer teksten og putter inn navnet du skrev inn i inputfeltet

var endreText = function (ord) {
    text.innerHTML = ord.replace("Karakter navn", characterName);
};

//Nå vil vi endre bilde til riktig format, slik at det ikke ser stygt ut
var endreImg = function (img) {
    images.style.backgroundImage = "url(" + img + ")"
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
    endreImg(s.image);
    endreText(s.text);
    endreButtons(s.buttons);
};

//Til sist skal jeg lage objektet som inneholder hvert eneste scenario, desto flere scenarioer jeg lager, desto flere valgmuligheter får jeg
var scenario = {
    one: {
        image: "",
        text: "You find yourself covered in blood with a massive headache. You have no clue of what has happened. When you sit up and turn around you see a bloody axe and some bloody trails. These trails lead straight into the dark forest ahead.",
    },
    two: {
        image: "",
        text: "Karakter navn, do you want to proceed into the forest following the trails?",
        buttons: [["Run away from the forest", "advanceTo(scenario.three)"], ["Follow the bloody trails", "advanceTo(scenario.four)"]]
    },
    three: {
        image: "",
        text: "You run away from the forest, desperately trying to figure out what happened. Suddenly a pack of wild dogs seems to caught your smell, and your only option is to run back into the forest.",
        buttons: [["Continue", "advanceTo(scenario.four)"]]
    },
    four: {
        image: "",
        text: "The dark forest overwhelms you as you run in. The sound of barking dogs leave your area, and you start slowing down. You look behind you to see if any dogs followed your path, but everyone's gone. As you turn around a scream fills the forest.",
        buttons: [["Follow the scream", "advanceTo(scenario.five_2)"], ["Follow the bloody trails", "advanceTo(scenario.five)"]]
    },
    five: {
        images: "",
        text: "You follow the bloody trails deeper into the forest. A cabin appears in the distance, it's hidden in a dense forest landscape. The trails lead directly at it and as you get closer you see that the door is open.",
        buttons: [["Enter the cabin without thinking", "advanceTo(scenario.six)"], ["Approach the cabin slowly", "advanceTo(scenario.six_2)"]]
    },
    five_2: {
        images: "",
        text: "",
        buttons: []
    },
    six: {
        images: "",
        text: "The stench of rotten blood fills your nose. The door at the other end of the hallway leads outside, that door is open as well. It doesn't seem like there are other rooms than this hallway... ",
        buttons: [["Go out through the door at the end of the hallway", "advanceTo(scenario.seven)"]]
    },
    six_2: {
        images: "",
        text: "",
        buttons: []
    }
};

advanceTo(scenario.one);