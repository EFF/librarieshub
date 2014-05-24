var aws = require("aws-lib");

var client = aws.createProdAdvClient(process.env.AMAZON_KEY_ID, process.env.AMAZON_SECRET_KEY_ID, process.env.AMAZON_ASSOCIATE_TAG);

module.exports = {
    lookupByISBN: function(isbn, callback){
        var options = {
            SearchIndex: "Books",
            IdType: "ISBN",
            ItemId: isbn,
            ResponseGroup: "ItemAttributes, Images, EditorialReview"
        };
        client.call("ItemLookup", options, function(err, result) {
            var data = {};
            if(result && result.Items && result.Items.Item){
                var item = result.Items.Item;
                if(item.DetailPageURL){
                    data['amazon_link'] = item.DetailPageURL;
                }
                if(item.SmallImage && item.SmallImage.URL){
                    data.thumbnail = item.SmallImage.URL;
                }
                if(item.ItemAttributes){
                    var attributes = item.ItemAttributes;
                    if(attributes.Author){
                        data.auteur = attributes.Author;
                    }
                    if(attributes.Publisher){
                        data.editeur = attributes.Publisher;
                    }
                    if(attributes.Title){
                        data.titre = attributes.Title;
                    }
                }
            }
            callback(null, data);
        });
    }
};
