APPEND_TO_PATH?=''

TESTS_FOLDER=$(join $(CURDIR), $(APPEND_TO_PATH))

test-unit:
	@NODE_ENV=test \
	jasmine-node \
		$(TESTS_FOLDER)/server/unit/ \
		--verbose \
		--coffee \

test-all: test-unit

.PHONY: test-all test-unit
