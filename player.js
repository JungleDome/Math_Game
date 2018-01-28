module.exports = function(args) {
        if (args.socketID) {var socketID = args.socketID;}
        else {console.trace('No player socketID provided.');}

        if (args.ID) {var ID = args.ID;}
        else {console.trace('No player ID provided.');}

        if (args.name) {var name = args.name;}
        else {console.trace('No player name provided.');}

        if (args.rank) {var rank = args.rank;}
        else {console.trace('No player ranking point provided.');}

        if (args.coin!==null) {var coin = args.coin;}
        else {console.trace('No player coin provided.');}

        if (args.history) {var history = args.history;}
        else {var history = null;}

        return {
            socketID:socketID,
            ID:ID,
            name:name,
            rank:rank,
            coin:coin,
            history:history,
			
			addRank: function(amount) {
				this.rank += amount;
			},
            minusRank: function(amount) {
                this.rank -= amount;
            },
            addCoin: function(amount) {
                this.coin += amount;
            },
            minusCoin: function(amount) {
                this.coin -= amount;
            },
			changeHistory: function(args) {
				this.history = args;
			}
        }
};