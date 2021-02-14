#!/bin/bash


#cd src/backend


# Setup DB or any other environment variables you want to setup.
mongo meme --eval "db.dropDatabase()" 

npm install

npm run dev
