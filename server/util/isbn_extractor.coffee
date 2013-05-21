###
Clean the isbn field to extract the isbn sequence only
Examples of "dirty" isbn:
  9.78155E+12
  2892499224 (br.) : 9,95 $
###
class IsbnExtractor

    extract: (isbn) ->
        # TODO: Check checksum digit
        # See: http://en.wikipedia.org/wiki/International_Standard_Book_Number
        if isbn.length >= 10
            isbn = isbn.replace '-', ''
            
            # Check for ISBN 13
            result = isbn.match(/([0-9]{13})/)
            if result and result[0]
                return result[0]

            # Check for ISBN10
            result = isbn.match(/([0-9]{9}[0-9X])/i)
            if result and result[0]
                return result[0]

        return false

module.exports = new IsbnExtractor()
