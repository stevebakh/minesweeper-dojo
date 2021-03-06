
function Position (x, y) {
    this.x = x;
    this.y = y;
    this.uncovered = false;
    this.activeMine = false;
    this.flagged = false;
    this.adjacentPositions = [];
}

Position.prototype.isFlagged = function() {
    return this.flagged;
};

Position.prototype.flag = function() {
    this.flagged = true;
};

Position.prototype.unflag = function() {
    this.flagged = false;
};

Position.prototype.hasActiveMine = function() {
    return this.activeMine;
};

Position.prototype.activateMine = function() {
    this.activeMine = true;
};

Position.prototype.addAdjacentPosition = function(position) {
    this.adjacentPositions.push(position);
};

Position.prototype.hasAdjacentMine = function() {
    return this.getAdjacentMineCount() > 0;
};

Position.prototype.getAdjacentMineCount = function() {
    var count = 0;

    this.adjacentPositions.forEach(function (adjacentPosition) {
        if (adjacentPosition.hasActiveMine()) {
            count++;
        }
    });

    return count;
};

Position.prototype.uncover = function() {
    if (!this.uncovered) {
        this.uncovered = true;
        
        console.log('Uncovering position: ' + this.x + ',' + this.y);
        
        GameEventManager.triggerEvent(new GameEvent('position-uncovered', this));

        if (this.activeMine) {
            console.log('Mine detonated at position: ' + this.x + ',' + this.y);
            GameEventManager.triggerEvent(new GameEvent('mine-detonated', this));
        } else if (!this.hasAdjacentMine()) {
            // Loop through and uncover all of the adjacent positions that have not yet been uncovered.
            this.adjacentPositions.forEach(function (adjacentPosition) {
                adjacentPosition.uncover();
            });
        }
    }
};
