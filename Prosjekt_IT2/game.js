var scale = 40; //gir en scale med tall over hvor mange pixler en enkel unit kan ta opp på skjermen

//Hjelpefunksjon for å opprette et element i DOM og gir den en klasse
function elmnt(name, className) {
    var elmnt = document.createElement(name); //lager elementet
    if (className) elmnt.className = className; //setter klassen til className hvis du gir den et argument
    return elmnt;
}

//Function constructor for display 
function DOMDisplay(parent, level) {
    this.wrap = parent.appendChild(elmnt("div", "game")); //lager en div som heter game, og lagrer den som en wrapper, fordi appendChild returnerer det elementet
    this.level = level;

    this.wrap.appendChild(this.drawBackground()); //drawbackground() er ikke blitt lagt til enda, men du vil adde den til en wrapper eller element
    this.actorLayer = null;
    this.drawFrame();
}

DOMDisplay.prototype.drawBackground = function () {
    var table = elmnt("table", "background"); //lager et table-element med en class av bakgrunnen
    table.style.width = this.level.width * scale + "px"; //lager bredden av bakgrunnen i forhold til scale

    this.level.grid.forEach(function (row) {
        var rowElmnt = table.appendChild(elmnt("tr"));
        rowElmnt.style.height = scale + "px";
        row.forEach(function (type) {
            rowElmnt.appendChild(elmnt("td", type));
        });
    });
    return table; // returnerer den lagde backgrunnen over
};

DOMDisplay.prototype.drawActors = function () {
    var wrap = elmnt("div"); //lager en div og adder dem i wrapper for drawActors
    this.level.actors.forEach(function (actor) { //går over hver actor
        var rect = wrap.appendChild(elmnt("div", "actor" + actor.type)); //lager en div med class actor, og hvilken type actor er
        rect.style.width = actor.size.x * scale + "px";
        rect.style.height = actor.size.y * scale + "px";
        rect.style.left = actor.pos.x * scale + "px";
        rect.style.top = actor.pos.y * scale + "px";
    });
    return wrap; // returnerer wrap med alle actors
};

DOMDisplay.prototype.drawFrame = function () {
    if (this.actorLayer) { //hvis en actorLayer finner, fjern den
        this.wrap.removeChild(this.actorLayer);
    }
    this.actorLayer = this.wrap.appendChild(this.drawActors()); //adder actor layer til wrap
    this.wrap.className = "game" + (this.level.status || ""); //Med dette kan vi endre style til playeren når det er en status på wrapperen
    this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function () {
    var width = this.wrap.clientWidth;
    var height = this.wrap.clientHeight;
    var margin = width / 3;

    var left = this.wrap.scrollLeft, right = left + width;
    var top = this.wrap.scrollTop, bottom = top + height;

    var player = this.level.player;
    var center = player.pos.plus(player.size.times(.5)).times(scale);

    if (center.x < left + margin) {
        this.wrap.scrollLeft = center.x - margin;
    } else if (center.x > right - margin) {
        this.wrap.scrollLeft = center.x + margin - width;
    }
    if (center.y < top + margin) {
        this.wrap.scrollTop = center.y - margin;
    } else if (center.y > bottom - margin) {
        this.wrap.scrollTop = center.y + margin - height;
    }
};

DOMDisplay.prototype.clear = function () {
    this.wrap.parentNode.removeChild(this.wrap);
};


var simpleLevelPlan = [[ // initial input for Level
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "  x              = x  ",
    "  x         o o    x  ",
    "  x @      xxxxx   x  ",
    "  xxxxx            x  ",
    "      x!!!!!!!!!!!!x  ",
    "      xxxxxxxxxxxxxx  ",
    "                      "
],
    [
        "                      ",
        "                      ",
        "                      ",
        "                      ",
        "                      ",
        "                      ",
        "                      ",
        "                      ",
        "                      ",
        "                      ",
        "  x              = x  ",
        "  x             o  x  ",
        "  x @         = xx x  ",
        "  xxxxx    xx    = x  ",
        "      xxx!!!!!!!!!!x  ",
        "      xxxxx!!!!xxxxx  ",
        "                      "
    ]];

var actorChars = {
    "@" : Player,
    "o" : Coin,
    "=" : Lava, "|" : Lava, "v" : Lava
};

//Player constructor
function Player(pos) {
    this.pos = pos.plus(new Vector(0, -0.5)); //
    this.size = new Vector(.8, 1.5); // .8 bred og 1.5 høy
    this.speed = new Vector(0, 0); //Starting speed
}

Player.prototype.type = "player";

var playerXSpeed = 7;
Player.prototype.moveX = function (step, level, keys) {
    this.speed.x = 0;
    if (keys.left) this.speed.x -= playerXSpeed;
    if (keys.right) this.speed.x += playerXSpeed;

    var motion = new Vector(this.speed.x * step, 0);
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle) {
        level.playerTouched(obstacle);
    } else {
        this.pos = newPos;
    }
};

var gravity = 10;
var jumpSpeed = 7;
Player.prototype.moveY = function (step, level, keys) {
    this.speed.y += step * gravity;
    var motion = new Vector(0, this.speed.y * step);
    var newPos = this.pos.plus(motion);
    var obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle) {
        level.playerTouched(obstacle);
        if(keys.up && this.speed.y > 0) {
            this.speed.y = -jumpSpeed;
        } else {
            this.speed.y = 0;
        }
    }   else {
        this.pos = newPos;
    }
};

Player.prototype.act= function (step, level, keys) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);

    var otherActor = level.actorAt(this);
    if (otherActor) {
        level.playerTouched(otherActor.type, otherActor);
    }
    if (level.status === "lost") {
        this.pos.y += step;
        this.size.y -= step;
    }
};

//Lava Constructor
function Lava(pos, ch) {
    this.pos = pos;
    this.size = new Vector(1, 1); //tar opp 1X1
    if (ch === "=") {
        this.speed = new Vector(2, 0) //horisontal lava
    } else if (ch === "|") {
        this.speed = new Vector(0, 2) //vertikal lava, opp og ned
    }else if (ch === "v") {
        this.speed = new Vector(0, 3);
        this.repeatPos = pos; //starting punktet for lavaen til å begynne på igjen
    }
}

Lava.prototype.type = "lava";

Lava.prototype.act = function (step, level) {
    var newPos = this.pos.plus(this.speed.times(step));
    if (!level.obstacleAt(newPos, this.size)) {
        this.pos = newPos;
    } else if (this.repeatPos) {
        this.pos = this.repeatPos;
    } else {
        this.speed = this.speed.times(-1);
    }
};

var wobbleSpeed = 8, wobbleDis = .07;
//Coin Constructor
function Coin(pos) {
    this.basePos = this.pos = pos.plus(new Vector(.2, .1)); //beveger den inn litt, og tracker startpunktet
    this.size = new Vector(.6, .6); //.6X.6 i størrelse
    this.wobble = Math.random() * Math.PI * 2; //Beveger seg randomly i en kurve
}

Coin.prototype.type = "coin";

Coin.prototype.act = function (step) {
    this.wobble += step * wobbleSpeed;
    var wobblePos = Math.sin(this.wobble) * wobbleDis;
    this.pos = this.basePos.plus(new Vector(0, wobblePos));
}


//Vector Constructor
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function (other) {
    return new Vector(this.x + other.x, this.y + other.y)
};

Vector.prototype.times = function (faktor) {
    return new Vector(this.x * faktor, this.y * faktor)
};



var maxStep = .05;

//Level Constructor
function Level(plan) {
    this.width = plan[0].length; //hvor mange characters i en string
    this.height = plan.length; //hvor mange rows høy spillet er
    this.grid = []; //dette er selve rommet du beveger deg i, environment; lava, vegger, empty space
    this.actors = []; //array av actors

    for (var y = 0; y < this.height; y++) {
        var line = plan[y];
        var gridLine = [];
        for (var x = 0; x < this.width; x++) {
            var ch = line[x];
            var fieldType = null;
            var Actor = actorChars[ch];

            if(Actor) {
                this.actors.push(new Actor(new Vector(x, y), ch));
            } else if (ch === "x") {
                fieldType = "wall";
            } else if (ch === "!") {
                fieldType = "lava";
            }
            gridLine.push(fieldType);
        }
        this.grid.push(gridLine);
    }

    this.player = this.actors.filter(function (actor) {
        return actor.type === "player";
    })[0];
    this.status = this.finishDlay = null;
}

Level.prototype.erFerdig = function () {
    return this.status != null && this.finishDlay < 0;
};

Level.prototype.obstacleAt = function (pos, size) {
    var xStart = Math.floor(pos.x);
    var xSlutt = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var ySlutt = Math.ceil(pos.y + size.y);

    if (xStart < 0 || xSlutt > this.width || yStart < 0) {
        return "wall";
    }
    if (ySlutt > this.height) {
        return "lava";
    }
    for (var y = yStart; y < ySlutt; y++) {
        for (var x = xStart; x < xSlutt; x++) {
            var fieldType = this.grid[y][x];
            if (fieldType) return fieldType;
        }
    }
};

Level.prototype.actorAt = function (actor) {
    for (var i = 0; i < this.actors.length; i++) {
        var other = this.actors[i];
        if (other !== actor&&
            actor.pos.x + actor.size.x > other.pos.x &&
            actor.pos.x < other.pos.x + other.size.x &&
            actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y) {
            return other;
        }
    }
};

Level.prototype.animate = function (step, keys) {
    if (this.status != null) {
        this.finishDlay -= step;
    }

    while (step > 0) {
        var thisStep = Math.min(step, maxStep);
        this.actors.forEach(function (actor) {
            actor.act(thisStep, this, keys);
        }, this);
        step -= thisStep;
    }
};

Level.prototype.playerTouched = function (type, actor) {
    if (type == "lava" && this.status == null) {
        this.status = "lost";
        this.finishDlay = 1;
    } else if (type === "coin") {
        this.actors = this.actors.filter(function (other) {
            return other !== actor;
        });
        if (!this.actors.some(function (actor) {
                return actor.type === "coin";
            })) {
            this.status = "won";
            this.finishDlay = 1;
        }
    }
};


var kontrollCodes = {
    37: "left",
    38: "up",
    39: "right"
};
function trackKeys(codes) {
    var pressed = Object.create(null);
    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            var down = event.type == "keydown";
            pressed [codes[event.keyCode]] = down;
            event.preventDefault();
        }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
    return pressed;
}

function runAnimation(frameFunc) {
    var lastTime = null;
    function frame(time) {
        var stop = false;
        if (lastTime != null) {
            var timeStep = Math.min(time - lastTime, 100) / 1000;
            stop = frameFunc(timeStep) === false;
        }
        lastTime = time;
        if (!stop) {
            requestAnimationFrame(frame);
        }
    }
    requestAnimationFrame(frame);
}

function runLevel(level, Display, andThen) {
    var display = new Display(document.body, level);
    runAnimation(function (step) {
        level.animate(step, arrows);
        display.drawFrame(step);
        if (level.erFerdig()) {
            display.clear();
            if (andThen) {
                andThen(level.status);
            }
            return false;
        }
    });
}

function runGame(plans, Display) {
    function startLevel(n) {
        runLevel(new Level(plans[n]), Display, function (status) {
            if (status === "lost") {
                startLevel(n);
            } else if (n < plans.length - 1) {
                startLevel(n + 1);
            } else {
                console.log("You win!");
            }
        });
    }
    startLevel(0);
}

var arrows = trackKeys(kontrollCodes);
var simpleLevel = new Level(simpleLevelPlan);
runGame(simpleLevelPlan, DOMDisplay);

