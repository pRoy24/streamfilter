var LineItem = require('../schema/LineItem');


module.exports = {
    getRawLines: function(queryTerm) {
        return LineItem.find({ queryTerm: queryTerm}).then(function(termResponse){
            return termResponse.slice(0, 30);
        });
    },
    
    
    dispenseRewards: function(contract) {
        LineItem.find({}).then(function(lineItemResponse){
            lineItemResponse.forEach(function(item, idx){
                setTimeout(function(){
                    var itemObject = item.toObject();
                    let contentID = itemObject.contentID;
                    contract.methods.calcScoreAndSendRewardsIfNeeded(contentID).call({from: process.env.USER_ADDRESS}, function(error, result){
                        console.log(result);
                    });
                }, idx * 100);
            })
        });
    }
}