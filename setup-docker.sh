#!/bin/sh

# -- INSTALL DOCKER --

# Uninstall old versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# Update the apt package index
sudo apt-get update

# Install packages to allow apt to use a repository over HTTPS
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# set up the stable repository
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# Update the apt package index
sudo apt-get update

# Install the latest version of Docker Engine - Community and containerd
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# -- INSTALL DOCKER-COMPOSE --

# download the current stable release of Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# create symlinks
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
