#!/bin/sh

# -- INSTALL AND RUN APP --

# Create app directory and move
sudo mkdir /home/app
cd /home/app

# clone repo and move
sudo git clone https://github.com/LeoGeneret/SSP3.git
cd SSP3/

# Retrieve myip and pass value to .env
sudo mv /mypublicip .env

# launch docker-compose
sudo docker-compose -f docker-compose-prod.yml up -d


