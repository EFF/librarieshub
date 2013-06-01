amazonProductConnector = require '../../../../server/connectors/amazon_product'
stubResponses = require './stub_responses/stub_responses'

describe 'AmazonProductConnector', ->

    it 'should return valid data with a response from a valid request', () ->
        callbackSpy = jasmine.createSpy('callback')
        response = stubResponses.get("amazon_lookup_isbn_valid")

        amazonProductConnector._lookupByISBNCallback(callbackSpy, null, response)

        expect(callbackSpy).toHaveBeenCalledWith(null,
            amazon_link: "http://www.amazon.com/Harry-Potter-Sorcerers-Stone-Book/dp/059035342X%3FSubscriptionId%3DA" +
            "KIAJAHG2DA422GGAOGA%26tag%3Dbiblio0b-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeAS" +
            "IN%3D059035342X"
            auteur: "J.K. Rowling"
            editeur: "Scholastic"
            titre: "Harry Potter and the Sorcerer's Stone (Book 1)",
            thumbnail: "http://ecx.images-amazon.com/images/I/51MU5VilKpL._SL110_.jpg"
        )

    it 'should return empty with a response from an invalid request', () ->
        callbackSpy = jasmine.createSpy('callback')
        response = stubResponses.get("amazon_lookup_isbn_invalid")

        amazonProductConnector._lookupByISBNCallback(callbackSpy, null, response)

        expect(callbackSpy).toHaveBeenCalledWith(null, {})

