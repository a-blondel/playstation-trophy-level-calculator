const trophyPoints = {
    previous: { bronze: 15, silver: 30, gold: 90, platinum: 180 },
    current: { bronze: 15, silver: 30, gold: 90, platinum: 300 }
};

const levels = [
    { name: 'Bronze 2', target: 100 },
    { name: 'Bronze 3', target: 200 },
    { name: 'Silver 1', target: 300 },
    { name: 'Silver 2', target: 400 },
    { name: 'Silver 3', target: 500 },
    { name: 'Gold 1', target: 600 },
    { name: 'Gold 2', target: 700 },
    { name: 'Gold 3', target: 800 },
    { name: 'Platinum', target: 999 },
];

function calculatePoints(system, bronze, silver, gold, platinum) {
    return bronze * trophyPoints[system].bronze +
           silver * trophyPoints[system].silver +
           gold * trophyPoints[system].gold +
           platinum * trophyPoints[system].platinum;
}

function getPointsForLevel(system, level) {
    let totalPoints = 0;

    if (system === 'previous') {
        const levelPoints = [0, 200, 600, 1200, 2400, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 24000];
        if (level < 14) {
            totalPoints = levelPoints[level - 1]; // the level starts at 1 but the index of the array starts at 0
        } else {
            totalPoints = levelPoints[12] + 8000 * (level - 13);
        }
    } else if (system === 'current') {
        for (let i = 1; i < level; i++) { // the level starts at 1 so the loop starts at 1
            if (i < 100) {
                totalPoints += 60;
            } else if (i < 200) {
                totalPoints += 90;
            } else if (i < 300) {
                totalPoints += 450;
            } else if (i < 400) {
                totalPoints += 900;
            } else if (i < 500) {
                totalPoints += 1350;
            } else if (i < 600) {
                totalPoints += 1800;
            } else if (i < 700) {
                totalPoints += 2250;
            } else if (i < 800) {
                totalPoints += 2700;
            } else if (i < 900) {
                totalPoints += 3150;
            } else {
                totalPoints += 3600;
            }
        }
    }

    return totalPoints;
}

function calculateLevel(system, points) {
    let level = 1; // the level starts at 1
    let totalPoints = 0;

    while (totalPoints <= points) {
        totalPoints = getPointsForLevel(system, level + 1);
        if (totalPoints <= points) {
            level++;
        }
    }

    return level;
}

function getLevelImage(level) {
    let imagePath = 'img/level/current/bronze_level_1.webp';
    if (level <= 99) imagePath = 'img/level/current/bronze_level_1.webp';
    else if (level <= 199) imagePath = 'img/level/current/bronze_level_2.webp';
    else if (level <= 299) imagePath = 'img/level/current/bronze_level_3.webp';
    else if (level <= 399) imagePath = 'img/level/current/silver_level_1.webp';
    else if (level <= 499) imagePath = 'img/level/current/silver_level_2.webp';
    else if (level <= 599) imagePath = 'img/level/current/silver_level_3.webp';
    else if (level <= 699) imagePath = 'img/level/current/gold_level_1.webp';
    else if (level <= 799) imagePath = 'img/level/current/gold_level_2.webp';
    else if (level <= 998) imagePath = 'img/level/current/gold_level_3.webp';
    else if (level == 999) imagePath = 'img/level/current/platinum_level.webp'
    return imagePath;
}

function defineNextSteps(currentPoints, currentLevel) {
    const template = document.getElementById('progress-bar-template');
    const container = document.querySelector('.next-steps');
    container.innerHTML = '';
    for (let i = 0; i < levels.length; i++) {
        const nextLevel = levels[i].target;
        if(nextLevel > currentLevel) {
            const clone = template.content.cloneNode(true);
            const nextLevelRequiredPoints = getPointsForLevel('current', nextLevel);
            const progressPercentage = Math.floor((currentPoints) / (nextLevelRequiredPoints) * 100);
            var progressBar = clone.getElementById('current-system-current-progress');
            clone.getElementById('current-system-current-level-image').src = getLevelImage(currentLevel);
            clone.getElementById('current-system-current-level').textContent = currentLevel;
            clone.getElementById('current-system-current-points').textContent = currentPoints;
            clone.getElementById('current-system-progress-percentage').textContent = progressPercentage + '%';
            progressBar.style.width = progressPercentage + '%' ;
            progressBar.setAttribute('aria-valuenow', progressPercentage);
            clone.getElementById('current-system-points-until-next').textContent = nextLevelRequiredPoints - currentPoints + ' left';
            clone.getElementById('current-system-next-level-requirement').textContent = nextLevelRequiredPoints;
            clone.getElementById('current-system-next-level-image').src = getLevelImage(nextLevel);
            clone.getElementById('current-system-next-level').textContent = nextLevel;
        
            container.appendChild(clone);
        }
    }
}

function updateData() {
    const bronze = parseInt(document.getElementById('current-bronze').value) || 0;
    const silver = parseInt(document.getElementById('current-silver').value) || 0;
    const gold = parseInt(document.getElementById('current-gold').value) || 0;
    const platinum = parseInt(document.getElementById('current-platinum').value) || 0;

    ['previous', 'current'].forEach(system => {
        const currentPoints = calculatePoints(system, bronze, silver, gold, platinum);
        const currentLevel = calculateLevel(system, currentPoints);
        const currentLevelRequiredPoints = getPointsForLevel(system, currentLevel);
        const nextLevel = currentLevel + 1;
        const nextLevelRequiredPoints = getPointsForLevel(system, nextLevel);
        const progressPercentage = Math.floor((currentPoints - currentLevelRequiredPoints) / (nextLevelRequiredPoints - currentLevelRequiredPoints) * 100);

        var progressBar = document.getElementById(system + '-system-current-progress');
        document.getElementById(system + '-system-current-points').textContent = currentPoints;

        if (system === 'previous') {
            document.getElementById(system + '-system-current-level').textContent = currentLevel <= 100 ? currentLevel : 100;
            document.getElementById(system + '-system-next-level').textContent = nextLevel <= 100 ? nextLevel : 100;
            document.getElementById(system + '-system-current-level-requirement').textContent = currentLevel <= 100 ? currentLevelRequiredPoints : 0;
            document.getElementById(system + '-system-next-level-requirement').textContent = nextLevel <= 100 ? nextLevelRequiredPoints : 0;
            document.getElementById(system + '-system-points-until-next').textContent = nextLevel <= 100 ? nextLevelRequiredPoints - currentPoints + ' left' : '0 left';
            document.getElementById(system + '-system-progress-percentage').textContent = nextLevel <= 100 ? progressPercentage + '%' : '100%';
            progressBar.style.width = nextLevel <= 100 ? progressPercentage + '%' : '100%';
            progressBar.setAttribute('aria-valuenow', nextLevel <= 100 ? progressPercentage : 100);
        } else if (system === 'current') {
            document.getElementById(system + '-system-current-level').textContent = currentLevel <= 999 ? currentLevel : 999;
            document.getElementById(system + '-system-next-level').textContent = nextLevel <= 999 ? nextLevel : 999;
            const currentLevelimagePath = getLevelImage(currentLevel <= 999 ? currentLevel : 999);
            const nextLevelImagePath = getLevelImage(nextLevel <= 999 ? nextLevel : 999);
            document.getElementById('current-system-current-level-image').src = currentLevelimagePath;
            document.getElementById('current-system-next-level-image').src = nextLevelImagePath;
            
            document.getElementById(system + '-system-current-level-requirement').textContent = currentLevel <= 999 ? currentLevelRequiredPoints : 0;
            document.getElementById(system + '-system-next-level-requirement').textContent = nextLevel <= 999 ? nextLevelRequiredPoints : 0;
            document.getElementById(system + '-system-points-until-next').textContent = nextLevel <= 999 ? nextLevelRequiredPoints - currentPoints + ' left' : '0 left';
            document.getElementById(system + '-system-progress-percentage').textContent = nextLevel <= 999 ? progressPercentage + '%' : '100%';
            progressBar.style.width = nextLevel <= 999 ? progressPercentage + '%' : '100%';
            progressBar.setAttribute('aria-valuenow', nextLevel <= 999 ? progressPercentage : 100);
        }

        if(system === 'current') {
            defineNextSteps(currentPoints, currentLevel);
        }
        
    });
}

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', updateData);
});

// Call updateData on page load
window.onload = updateData;