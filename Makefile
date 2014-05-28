compile-javascript:
	./compile_javascript.sh

nodemon:
	make compile-javascript
	foreman start -f Procfile.dev -p 3000

.PHONY: nodemon compile-javascript
