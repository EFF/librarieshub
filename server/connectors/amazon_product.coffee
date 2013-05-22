OperationHelper = require('apac').OperationHelper;

class AmazonProductConnector

    constructor: () ->
        @credentials = {
            awsId: process.env.AMAZON_KEY_ID,
            awsSecret: process.env.AMAZON_SECRET_KEY_ID,
            assocId: process.env.AMAZON_ASSOCIATE_TAG,            
        }

    lookupByISBN: (isbn, callback) ->
        # TODO: Write a wrapper for the Amazon Product API myself
        # this one is shitty and not maintained anymore
        # It needs to create a new OperationHelper each time
        new OperationHelper(@credentials).execute 'ItemLookup', {
            IdType: "ISBN"
            ItemId: isbn,
            SearchIndex: "Books",
            ResponseGroup: "ItemAttributes, Images, EditorialReview",
        }, @_lookupByISBNCallback.bind(@, callback)

    _lookupByISBNCallback: (callback, err, response) ->
        if err
            callback err
        else
            data = {}
            if response.ItemLookupResponse and response.ItemLookupResponse.Items and response.ItemLookupResponse.Items[0].Item
                item = response.ItemLookupResponse.Items[0].Item[0]

                if item.DetailPageURL
                    data.amazon_link = item.DetailPageURL[0]
                if item.ItemAttributes
                    attributes = item.ItemAttributes[0]
                    if attributes.Author
                        data.auteur = attributes.Author.join(', ')
                    if attributes.Publisher
                        data.editeur = attributes.Publisher.join(', ')
                    if attributes.Title
                        data.titre = attributes.Title.join(', ')
                if item.ImageSets and item.ImageSets[0].ImageSet and item.ImageSets[0].ImageSet[0].TinyImage and item.ImageSets[0].ImageSet[0].TinyImage[0].URL
                    data.thumbnail = item.ImageSets[0].ImageSet[0].TinyImage[0].URL[0]

            callback null, data

module.exports = new AmazonProductConnector()
