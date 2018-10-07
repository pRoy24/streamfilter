var LineItem = require('../schema/LineItem');

module.exports = {
    getRawLines: function(queryTerm) {
        return LineItem.find({ queryTerm: queryTerm}).then(function(termResponse){
            return termResponse.slice(0, 30);
        });
    }
}