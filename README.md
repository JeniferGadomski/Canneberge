# Platforme Canneberge

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

Ouvrir un  navigateur web : <<ADRESSE IP>>:8000
Exemple : _10.248.196.99:8000_

# Base de données
Connection avec Robomongo

 * Adresse : ds139969.mlab.com
 * Port : 39969
 * Authentificaiton
    * Databse : canneberge-database
    * User Name : bhacaz
    * Password : <<Demander>>