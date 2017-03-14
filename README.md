# Platforme Canneberge


Configuration :

- OS : Ubuntu 16.04 LTS
- Node JS : v6.10.0
- npm : 3.10.10
- bower : 1.8.0
- ng : 1.0.0-beta.28.3
- pm2 : 2.4.0

## Installation de dependance

	$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	$ sudo apt-get install -y nodejs
    $ sudo apt-get install npm
    $ sudo ln -s /usr/bin/nodejs /usr/bin/node
    $ sudo npm install -g angular-cli bower pm2

## Cloner le projet
Téléchargement du la platforme localement

    $ git clone https://github.com/Bhacaz/Platforme-Canneberge.git

## Initialiser
Ouvrer un terminal (Ctlr + Alt + T) et naviguer jusqu'au dossier Platforme-Canneberge
### API

    $ cd API
    $ npm install

### Admin

	$ cd Admin
	$ npm install

Pour compiler le projet Admin

	$ cd Admin
	$ ng build

### Carte

    $ cd Carte
    $ npm install
    $ cd public
    $ bower install

### Portail

	$ cd Portail
	$ npm install
	$ cd public
	$ bower install

## Partir les 3 serveurs

	$ pm2 start ecosystem.json

## Base de données MongoDB
Connection avec Robomongo

 * Adresse : ds139969.mlab.com
 * Port : 39969
 * Authentificaiton
    * Databse : canneberge-database
    * User Name : bhacaz
    * Password : "Demander"


## Interpréteur R
Consulteur le fichier /Doc/R/Installation_Rserve.md

## Document pour les bugs

[Bugs -> Google Calc, Feuille 2](https://docs.google.com/spreadsheets/d/1C3X9shZRBUGFJRZjLsi7VNtN8FvPP1UO5NXW6SVH7Mw/edit?usp=sharing) 
