function setupCanvas(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = tileSize*(numTiles+uiWidth);
    canvas.height = tileSize*numTiles;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    ctx.imageSmoothingEnabled = false;
}

function drawSprite(sprite, x, y){
    ctx.drawImage(
        spritesheet,
        sprite*16,
        0,
        16,
        16,
        x*tileSize + shakeX,
        y*tileSize + shakeY,
        tileSize,
        tileSize
    );
}

function draw(){
    if(gameState == "running" || gameState == "dead"){  
        ctx.clearRect(0,0,canvas.width,canvas.height);

        screenshake();

        for(let i=0;i<numTiles;i++){
            for(let j=0;j<numTiles;j++){
                getTile(i,j).draw();
            }
        }

        for(let i=0;i<monsters.length;i++){
            monsters[i].draw();
        }

        player.draw();

        cat.draw();

        drawText("Level: "+level, 30, false, 40, "violet");
        drawText("Score: "+score, 30, false, 70, "violet");

        for(let i=0; i<player.spells.length; i++){
            let spellText = (i+1) + ") " + (player.spells[i] || "");                        
            drawText(spellText, 20, false, 110+i*40, "aqua");        
        }
    }
}

function tick(){
    for(let k=monsters.length-1;k>=0;k--){
        if(!monsters[k].dead){
            monsters[k].update();
        }else{
            monsters.splice(k,1);
        }
    }

    player.update();

    cat.update();

    if(player.dead && cat.dead){    
        addScore(score, false);
        gameState = "dead";
    }

    spawnCounter--;
    if(spawnCounter <= 0){  
        spawnMonster();
        spawnCounter = spawnRate;
        spawnRate--;
    }
}

function showTitle(){                                          
    ctx.fillStyle = 'rgba(0,0,0)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "title";

    drawText("Curdling of the", 40, true, canvas.height/2 - 110, "white");
    drawText("Cheese Wiz", 70, true, canvas.height/2 - 50, "white"); 

    drawScores(); 

    playSound("music");
}

function showStory(){                                          
    ctx.fillStyle = 'rgba(0,0,0)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "story";

    drawText("Many years ago in a country far far away young shepard took a rest in a cave.", 15, true, canvas.height/2 - 200, "white");
    drawText("Some say he escaped a rain storm, others claim he had a brief romantic encounter.", 15, true, canvas.height/2 - 180, "white");
    drawText("Anyway, he forgot his cheese sandwich and when he returned to the cave a while later", 15,true, canvas.height/2 - 160, "white");
    drawText("he found the cheese had undergone a monstrous transformation. Perhaps due to ", 15,true, canvas.height/2 - 140, "white");
    drawText("the influence of a peculiar mold in the cave the cheese had gained conciousness ", 15,true, canvas.height/2 - 120, "white");
    drawText("and rapidly evolved super-cheesy powers. The shepherd fled in panic when he realized", 15,true, canvas.height/2 - 100, "white");
    drawText("what he had inadvertently created. Cheese Wiz was born!", 15,true, canvas.height/2 - 80, "white");

    drawText("The young wizard soon realized that with great cheese follows - a bunch of hungry rodents.", 15,true, canvas.height/2 - 40, "white");
    drawText("Rats were crawling on the cave walls! The wizard was in dire straits, but help was near.", 15,true, canvas.height/2 - 20, "white");
    drawText("A ghostly figure appeared in the cave, and the rats halted in terror as they heard", 15,true, canvas.height/2, "white");
    drawText("a mighty roar echo through the tunnels. Ghost Cat! What would be a better companion", 15,true, canvas.height/2 + 20, "white");
    drawText("than a cat? the young wizard thought. And so a wondrous collaboration was created.", 15,true, canvas.height/2 + 40, "white");
    drawText("The magic powers of Cheese Wiz combined with the silky stealth of Ghost Cat turned out", 15,true, canvas.height/2 + 60, "white");
    drawText("to be more than a match for the slimy rats.", 15,true, canvas.height/2 + 80, "white");
    
    drawText("Controls", 15,true, canvas.height/2 + 120, "white");
    drawText("Cheese Wiz: W, A, S, D", 15,true, canvas.height/2 + 140, "white");
    drawText("Ghost Cat: I, J, K, L", 15,true, canvas.height/2 + 160, "white");
    drawText("Spells: 1-9", 15,true, canvas.height/2 + 180, "white");
    drawText("A game by Magnus Lindh.", 15,true, canvas.height/2 + 220, "white");
    drawText("Based on an excellent tutorial by Jeremiah Reid:", 15,true, canvas.height/2 + 240, "white");
    drawText("https://nluqo.github.io/broughlike-tutorial/", 15,true, canvas.height/2 + 260, "white");
}

function showInstructions(){                                          
    ctx.fillStyle = 'rgba(0,0,0)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "instructions";

    drawText("WOOP warps the players to a random passable tile.", 15, true, canvas.height/2 - 200, "white");
    drawText("QUAKE deals the monsters 2 damage for each adjacent wall.", 15,true, canvas.height/2 - 180, "white");
    drawText("MAELSTROM iterates over all monsters and teleports them to a random tile.", 15,true, canvas.height/2 - 160, "white");
    drawText("MULLIGAN resets the level and sets the wizard's HP to 1.", 15,true, canvas.height/2 - 140, "white");
    drawText("AURA heals both the wizard and any adjacent monsters.", 15,true, canvas.height/2 - 120, "white");
    drawText("DASH moves the wizard in the direction of the last move.", 15,true, canvas.height/2 - 100, "white");
    drawText("DIG replaces all walls with floors. The wizard is healed for 2 HP.", 15,true, canvas.height/2 - 80, "white");

    drawText("KINGMAKER heals all monsters and generates a treasure on their tile.", 15,true, canvas.height/2 - 40, "white");
    drawText("ALCHEMY turns all adjacent walls into floors with a treasure.", 15,true, canvas.height/2 - 20, "white");
    drawText("POWER makes the next wizard attack do 6 in damage.", 15,true, canvas.height/2, "white");
    drawText("BUBBLE duplicates spells.", 15,true, canvas.height/2 + 20, "white");
    drawText("BRAVERY gives the players a free turn by stunning all monsters.", 15,true, canvas.height/2 + 40, "white");
    drawText("BOLT operates in the direction of the wizard's last move and do 4 in damage.", 15,true, canvas.height/2 + 60, "white");
    drawText("CROSS operates in the 4 cardinal directions and deal 2 in damage.", 15,true, canvas.height/2 + 80, "white");
    
    drawText("EX operates in diagonal directions and deal 3 in damage.", 15,true, canvas.height/2 + 120, "white");
    drawText("WONDERWALL replaces all walls with treasures.", 15,true, canvas.height/2 + 140, "white");
    drawText("PLAGUE reduces monsters and players HP by 1.", 15,true, canvas.height/2 + 160, "white");
    drawText("IGNITE damages both the wizard and any adjacent monsters.", 15,true, canvas.height/2 + 180, "white");
    drawText("OVERPOWER transfers monster HP to wizard.", 15,true, canvas.height/2 + 200, "white");
    drawText("EQUALIZE shares the HP of cat and wizard.", 15,true, canvas.height/2 + 220, "white");
    drawText("", 15,true, canvas.height/2 + 240, "white");
}

function startGame(){                                           
    level = 1;
    score = 0;
    numSpells = 1;
    startLevel(startingHp,startingHp);

    gameState = "running";

    stopSound("music");
}

function startLevel(playerHp, catHp, playerSpells){  
    summon = false;
    spawnRate = 15;              
    spawnCounter = spawnRate;  

    generateLevel();

    player = new Player(randomPassableTile());
    player.hp = playerHp;
    if(playerSpells){
        player.spells = playerSpells;
    } 

    cat = new Cat(randomPassableTile());
    cat.hp = catHp;

    randomPassableTile().replace(Exit); 
}

function drawText(text, size, centered, textY, color){
    ctx.fillStyle = color;
    ctx.font = size + "px monospace";
    let textX;
    if(centered){
        textX = (canvas.width-ctx.measureText(text).width)/2;
    }else{
        textX = canvas.width-uiWidth*tileSize+25;
    }

    ctx.fillText(text, textX, textY);
}

function getScores(){
    if(localStorage["scores"]){
        return JSON.parse(localStorage["scores"]);
    }else{
        return [];
    }
}

function addScore(score, won){
    let scores = getScores();
    let scoreObject = {score: score, run: 1, totalScore: score, active: won};
    let lastScore = scores.pop();

    if(lastScore){
        if(lastScore.active){
            scoreObject.run = lastScore.run+1;
            scoreObject.totalScore += lastScore.totalScore;
        }else{
            scores.push(lastScore);
        }
    }
    scores.push(scoreObject);

    localStorage["scores"] = JSON.stringify(scores);
}

function drawScores(){
    let scores = getScores();
    if(scores.length){
        drawText(
            rightPad(["RUN","SCORE","TOTAL"]),
            18,
            true,
            canvas.height/2,
            "white"
        );

        let newestScore = scores.pop();
        scores.sort(function(a,b){
            return b.totalScore - a.totalScore;
        });
        scores.unshift(newestScore);

        for(let i=0;i<Math.min(10,scores.length);i++){
            let scoreText = rightPad([scores[i].run, scores[i].score, scores[i].totalScore]);
            drawText(
                scoreText,
                18,
                true,
                canvas.height/2 + 24+i*24,
                i == 0 ? "aqua" : "violet"
            );
        }
    }
}

function screenshake(){
    if(shakeAmount){
        shakeAmount--;
    }
    let shakeAngle = Math.random()*Math.PI*2;
    shakeX = Math.round(Math.cos(shakeAngle)*shakeAmount);
    shakeY = Math.round(Math.sin(shakeAngle)*shakeAmount);
}

function initSounds(){          
    sounds = {
        hit1: new Audio('sounds/hit1.wav'),
        hit2: new Audio('sounds/hit2.wav'),
        treasure: new Audio('sounds/treasure.wav'),
        newLevel: new Audio('sounds/newLevel.wav'),
        spell: new Audio('sounds/spell.wav'),
        music: new Audio('sounds/music.m4a'),
    };
}

function playSound(soundName){                       
    sounds[soundName].currentTime = 0;  
    sounds[soundName].play();
}

function stopSound(soundName){                       
    sounds[soundName].currentTime = 0;  
    sounds[soundName].pause();
}