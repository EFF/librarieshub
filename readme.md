# BiblioQuébec

This project first started a few years ago during the first Quebec City Hackathon in 2011. In 2013, the Openify.it team decided to revamp it.
http://capitaleouverte.org/2011/10/premier_hackathon_12_novembre/

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
