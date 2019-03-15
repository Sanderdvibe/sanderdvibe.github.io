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
        buttonBox.innerHTML += "<buttononClick="+buttonList[i][1]+">" + buttonList[i][0] + "</button>"
    }
};

//Så må vi få spillet til å gå videre, og da bruker jeg "advanceTo"
var advanceTo = function (s) {
    endreImg(s.image);
    endreText(s.text);
    endreButtons(s.buttons);
};

//Til sist skal jeg lage objektet som inneholder hvert eneste scenario, desto flere scenarioer jeg lager, desto flere valgmuligheter får jeg
