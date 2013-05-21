OperationHelper = require('apac').OperationHelper;

class AmazonProductConnector

    constructor: ->
        @credentials = {
            awsId: process.env.AMAZON_KEY_ID,
            awsSecret: process.env.AMAZON_SECRET_KEY_ID,
            assocId: process.env.AMAZON_ASSOCIATE_TAG,            
        }

    lookupByISBN: (isbn, callback) ->
        # TODO: Write a wrapper for the Amazon Product API myself
        # this one is shitty and not maintained anymore
        # Need to create a new OperationHelper each time
        operationHelper = new OperationHelper(@credentials)
        operationHelper.execute 'ItemLookup', {
            IdType: "ISBN"
            ItemId: isbn,
            SearchIndex: "Books",
            ResponseGroup: "ItemAttributes, Images, EditorialReview",
        }, callback

module.exports = new AmazonProductConnector()
