isbnExtractor = require '../../../../server/util/isbn_extractor'

describe 'ISBN extractor', ->

    it 'should extract valid ISBN', () ->
        expect(isbnExtractor.extract("2892499224")).toBeTruthy()
        expect(isbnExtractor.extract("289249922X")).toBeTruthy()
        expect(isbnExtractor.extract("2892499224345")).toBeTruthy()
        expect(isbnExtractor.extract("2892499224 (br.) : 9,95 $")).toBeTruthy()
        expect(isbnExtractor.extract("2892499224345 (br.) : 9,95 $")).toBeTruthy()
        expect(isbnExtractor.extract("05-90353427")).toBeTruthy()
        expect(isbnExtractor.extract("978-0590353427")).toBeTruthy()

    it 'should fail to extract invalid ISBN', ->
        expect(isbnExtractor.extract("9.78155E+12")).toBe(false)
        expect(isbnExtractor.extract("")).toBe(false)

