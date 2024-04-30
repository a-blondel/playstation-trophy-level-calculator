const trophyPoints = {
    previous: { bronze: 15, silver: 30, gold: 90, platinum: 180 },
    current: { bronze: 15, silver: 30, gold: 90, platinum: 300 }
};

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

function updateLevelImage(id, level) {
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
    else if (level == 999) imagePath = 'img/level/current/platinum_level.webp';
    document.getElementById(id).src = imagePath;
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
        const progressPercentage = Math.round((currentPoints - currentLevelRequiredPoints) / (nextLevelRequiredPoints - currentLevelRequiredPoints) * 100);

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
            updateLevelImage('current-system-current-level-image', currentLevel <= 999 ? currentLevel : 999);
            updateLevelImage('current-system-next-level-image', nextLevel <= 999 ? nextLevel : 999);
            document.getElementById(system + '-system-current-level-requirement').textContent = currentLevel <= 999 ? currentLevelRequiredPoints : 0;
            document.getElementById(system + '-system-next-level-requirement').textContent = nextLevel <= 999 ? nextLevelRequiredPoints : 0;
            document.getElementById(system + '-system-points-until-next').textContent = nextLevel <= 999 ? nextLevelRequiredPoints - currentPoints + ' left' : '0 left';
            document.getElementById(system + '-system-progress-percentage').textContent = nextLevel <= 999 ? progressPercentage + '%' : '100%';
            progressBar.style.width = nextLevel <= 999 ? progressPercentage + '%' : '100%';
            progressBar.setAttribute('aria-valuenow', nextLevel <= 999 ? progressPercentage : 100);
        }
        
    });
}

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', updateData);
});

// Call updateData on page load
window.onload = updateData;