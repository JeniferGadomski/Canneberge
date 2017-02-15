# Platforme Canneberge

## Installation de dependance

    $ sudo apt-get install nodejs npm
    $ sudo ln -s /usr/bin/nodejs /usr/bin/node
    $ sudo npm install -g angular-cli
    $ sudo npm install -g bower

## Cloner le projet
Téléchargement du la platforme localement

    $ git clone https://github.com/Bhacaz/Platforme-Canneberge.git
    
## Initialiser
Ouvrer un terminal (Ctlr + Alt + T) et naviguer jusqu'au dossier Platforme-Canneberge
### Canneberge_api

    $ cd Canneberge_api
    $ npm install

### Admin_Client

    $ cd Admin_Client
    $ npm install
    
### Carte

    $ cd Carte
    $ npm install
    $ cd public
    $ bower install

## Partir les 3 serveurs 

    $ ./start_platform.sh <<ADDRESSE IP>>

Ouvrir un  navigateur web : "ADRESSE IP":8000

Exemple : _10.248.196.99:8000_

# Base de données
Connection avec Robomongo

 * Adresse : ds139969.mlab.com
 * Port : 39969
 * Authentificaiton
    * Databse : canneberge-database
    * User Name : bhacaz
    * Password : "Demander"
    
    
    
# Serveur pour R

	$ sudo apt-get install r-base
	$ sudo R
	
## Installer Rserve

	> install.packages("Rserve")

## Demarer le serveur

	> require('Rserve')
	> Rserve()
	
## FastRWeb

	$ sudo apt-get install libcairo2-dev
	$ sudo apt-get install libxt-dev 
	$ sudo apt-get install libxml2-dev
	> install.packages('Cairo')
	> install.packages('FastRWeb')
	> install.packages('XML')
	$ sudo .~/R/***/FastRWeb/install.sh
	
### Changement de congif

/var/FastRWeb/code/rserve.conf

	http.port 8888
	remote enable
	source /var/FastRWeb/code/rserve.R
	control enable
	

/var/FastRWeb/code/rserve.R

	...
	## as well as define any global variables you want all
	## scripts to see

	## Today, pretty much everyone speaks UTF-8, it makes the life easier
	library(FastRWeb)
	.http.request <- FastRWeb:::.http.request

	Sys.setlocale(,"en_US.UTF-8")

	...


## Start FastRWeb

	$ sudo ./var/FastRWeb/code/start
	
Exemple : http://localhost:8888/example2
	
