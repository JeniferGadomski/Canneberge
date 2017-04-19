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
    $ sudo npm install -g angular-cli bower pm2 http-server
    $ sudo apt-get install gdal-bin


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

## Partir les serveurs

	$ pm2 start ecosystem.json
	
Pour monitorer la platform : 

	$ pm2 monit
	
*Penser a builder l'application Administrateur

### Monitorer sur le web et a distance
Pour avoir une belle interface web qui remplace *pm2 monit* consulter [keymetrics.io](http://docs.keymetrics.io/) 

## Serveur sur localhost
À titre d'information voici les ports par default de chaque application sur le *localhost* : 


Application  | Domaine | Port
--- | --- | ---
Administrateur |	[admin.canneberge.io](https://admin.canneberge.io)  |	8000
Carte |	[carte.canneberge.io](http://carte.canneberge.io)  |	3001
API |	[api.canneberge.io](http://api.canneberge.io)  |	8080
Interpréteur R |	[r.canneberge.io](http://r.canneberge.io)  |	8888
Portail |	[portail.canneberge.io](http://portail.canneberge.io)  |	8002
Documentation |	[doc.canneberge.io](http://doc.canneberge.io)  |	8001

















