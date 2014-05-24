var isbnExtractor = require('../server/util/isbn_extractor');

describe('ISBN extractor', function () {
    it('should extract valid ISBN', function () {
        expect(isbnExtractor.extract("2892499224")).toBe("2892499224");
        expect(isbnExtractor.extract("289249922X")).toBe("289249922X");
        expect(isbnExtractor.extract("2892499224345")).toBe("2892499224345");
        expect(isbnExtractor.extract("2892499224 (br.) : 9,95 $")).toBe("2892499224");
        expect(isbnExtractor.extract("2892499224345 (br.) : 9,95 $")).toBe("2892499224345");
        expect(isbnExtractor.extract("05-90353427")).toBe("0590353427");
        expect(isbnExtractor.extract("05 90353427")).toBe("0590353427");
        expect(isbnExtractor.extract("05.90353427")).toBe("0590353427");
        expect(isbnExtractor.extract("978-0590353427")).toBe("9780590353427");
        expect(isbnExtractor.extract("978 0590353427")).toBe("9780590353427");
        expect(isbnExtractor.extract("978.0590353427")).toBe("9780590353427");
    });
    it('should fail to extract invalid ISBN', function () {
        expect(isbnExtractor.extract("289249922")).toBe(false);
        expect(isbnExtractor.extract("28-9249922")).toBe(false);
        expect(isbnExtractor.extract("9.78155E+12")).toBe(false);
        expect(isbnExtractor.extract("")).toBe(false);
    });
});
