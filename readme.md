# BiblioQuébec

This project is a demo application built for the [Openify.it](http://openify.it) open data platform API. BiblioQuébec allows citizens to find books in the libraries catalogue and combine the results with the Amazon Products API.

BiblioQuébec (http://biblioquebec.openify.it) was started during the first Quebec city Hackathon in 2011. In 2013, the Openify.it team decided to revamp it.
http://capitaleouverte.org/2011/10/premier_hackathon_12_novembre/

## Used dataset
Bibliothèques – catalogue, provided by Quebec city, under their [data licence](http://donnees.ville.quebec.qc.ca/licence.aspx)

## How to install

    git clone git@github.com:OpenifyIt/librarieshub.git
    git submodule init
    git submodule update
    cd librarieshub
    npm install

## How to launch
    
You can easily start the server by running

    npm start
    
For development purposes, it's recommended to start the server using nodemon. This way you won't have to restart the server each time you modify a file. There's a shortcut in Makefile.

    make nodemon

## How to run tests
    
    npm test


## Design

Glasses designed by [Thomas Hirter](http://thenounproject.com/term/glasses/4938) from the Noun Project