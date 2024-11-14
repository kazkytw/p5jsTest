let monsters = [
  {name: "火焰獸", attack: 80, defense: 30, action: 50},
  {name: "石甲獸", attack: 50, defense: 90, action: 65},
  {name: "雷電獸", attack: 85, defense: 45, action: 70},
  {name: "冰霜獸", attack: 60, defense: 60, action: 55},
  {name: "暗影獸", attack: 75, defense: 50, action: 60},
  {name: "風暴獸", attack: 65, defense: 70, action: 80},
  {name: "毒霧獸", attack: 55, defense: 65, action: 45}
];

let results = [];
let battleStats = {}; // Object to store battle statistics for each monster

function setup() {
  createCanvas(1200, 1000);
  background(255);
  
  // Initialize battle statistics for each monster
  monsters.forEach(monster => {
    battleStats[monster.name] = { battles: 0, wins: 0, losses: 0, draws: 0 };
  });

  // Draw smaller scatter plot
  drawScatterPlot();

  // Calculate battle results
  calculateBattles();

  // Display battle results table
  displayBattleResults();

  // Display battle counts
  displayBattleCounts();
}

function drawScatterPlot() {
  stroke(0);
  line(100, 400, 400, 400); // x-axis for attack
  line(100, 400, 100, 100); // y-axis for defense
  
  textSize(16);
  fill(0);
  textAlign(CENTER, CENTER);
  text("Attack", 400, 430);
  textAlign(RIGHT, CENTER);
  text("Defense", 60, 100);
  
  for (let i = 0; i <= 100; i += 20) {
    let x = map(i, 0, 100, 100, 400);
    let y = map(i, 0, 100, 400, 100);
    
    line(x, 395, x, 405);
    noStroke();
    textSize(12);
    textAlign(CENTER, TOP);
    text(i, x, 410);
    
    stroke(0);
    line(95, y, 105, y);
    noStroke();
    textAlign(RIGHT, CENTER);
    text(i, 85, y);
  }
  
  stroke(150, 150, 150);
  line(100, 400, 400, 100); // Diagonal line representing the average
  
  monsters.forEach(monster => {
    let x = map(monster.attack, 0, 100, 100, 400);
    let y = map(monster.defense, 0, 100, 400, 100);
    
    fill(100, 100, 250);
    ellipse(x, y, 15, 15);
    
    textSize(12);
    fill(0);
    textAlign(LEFT, BOTTOM);
    text(`${monster.name} (${monster.action})`, x + 10, y - 10);
  });
}

function calculateBattles() {
  for (let i = 0; i < monsters.length; i++) {
    for (let j = i + 1; j < monsters.length; j++) {
      let monsterA = monsters[i];
      let monsterB = monsters[j];
      let result = battle(monsterA, monsterB);
      results.push(result);

      // Update battle statistics
      battleStats[monsterA.name].battles++;
      battleStats[monsterB.name].battles++;
      
      if (result.result.includes("wins")) {
        battleStats[result.winner].wins++;
        battleStats[result.loser].losses++;
      } else {
        battleStats[monsterA.name].draws++;
        battleStats[monsterB.name].draws++;
      }
    }
  }
}

function battle(monsterA, monsterB) {
  let attacker, defender;
  if (monsterA.action > monsterB.action) {
    attacker = monsterA;
    defender = monsterB;
  } else {
    attacker = monsterB;
    defender = monsterA;
  }

  let winner, loser, result;
  if (attacker.attack > defender.defense) {
    winner = attacker.name;
    loser = defender.name;
    result = `${attacker.name} wins`;
  } else if (defender.attack > attacker.defense) {
    winner = defender.name;
    loser = attacker.name;
    result = `${defender.name} wins`;
  } else {
    result = "Draw";
  }

  return {
    monsterA: attacker.name,
    monsterA_Attack: attacker.attack,
    monsterA_Defense: attacker.defense,
    monsterA_Action: attacker.action,
    monsterB: defender.name,
    monsterB_Attack: defender.attack,
    monsterB_Defense: defender.defense,
    monsterB_Action: defender.action,
    result: result,
    winner: winner,
    loser: loser
  };
}

function displayBattleResults() {
  let x = 500;
  let y = 100;
  textSize(14);
  fill(0);
  textAlign(LEFT);
  
  text("Monster A", x, y);
  text("Attack", x + 100, y);
  text("Defense", x + 150, y);
  text("Action", x + 200, y);
  text("Monster B", x + 300, y);
  text("Attack", x + 400, y);
  text("Defense", x + 450, y);
  text("Action", x + 500, y);
  text("Result", x + 600, y);

  y += 20;
  
  results.forEach(result => {
    text(result.monsterA, x, y);
    text(result.monsterA_Attack, x + 100, y);
    text(result.monsterA_Defense, x + 150, y);
    text(result.monsterA_Action, x + 200, y);
    text(result.monsterB, x + 300, y);
    text(result.monsterB_Attack, x + 400, y);
    text(result.monsterB_Defense, x + 450, y);
    text(result.monsterB_Action, x + 500, y);
    text(result.result, x + 600, y);
    
    y += 20;
  });
}

function displayBattleCounts() {
  let x = 500;
  let y = 700;
  textSize(14);
  fill(0);
  textAlign(LEFT);

  text("Monster", x, y);
  text("Battles", x + 150, y);
  text("Wins", x + 250, y);
  text("Losses", x + 350, y);
  text("Draws", x + 450, y);

  y += 20;

  for (let monster in battleStats) {
    text(monster, x, y);
    text(battleStats[monster].battles, x + 150, y);
    text(battleStats[monster].wins, x + 250, y);
    text(battleStats[monster].losses, x + 350, y);
    text(battleStats[monster].draws, x + 450, y);
    y += 20;
  }
}
