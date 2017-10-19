
# Documentation

## Clé et accès

### Clé Weather Underground

[API/app/config/config.js](https://github.com/Bhacaz/Platforme-Canneberge/blob/master/API/app/config/config.js#L6)

### Adresse serveur MongoDB
[API/app/config/config.js](https://github.com/Bhacaz/Platforme-Canneberge/blob/master/API/app/config/config.js#L5) 

### Clé Google Maps API

[Carte/index.html](https://github.com/Bhacaz/Platforme-Canneberge/blob/master/Carte/index.html#L19) 

## Documentation API

Générer avec [apiDoc](http://apidocjs.com) 

Installation :
	
	$ sudo npm install apidoc -g

Pour généré la documentation :

	$ cd API
	$ apidoc -i app/ -o ../Documentation/API
	
La génération va écraser la *navbar* dans [Documentation/API/index.html](https://github.com/Bhacaz/Platforme-Canneberge/blob/master/Documentation/API/index.html#L646) 


## MongoDB
### Base de données MongoDB (temporaire*)
Connection avec Robomongo

 * Adresse : ds139969.mlab.com
 * Port : 39969
 * Authentificaiton
    * Databse : canneberge-database
    * User Name : canneberge
    * Password : drainage1

\* L'utilisation de *mlab* est seulement utiliser pour le développement.

### Installation de MongoDB localement

Voir la [documentation](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition) de MongoDB.


## Google Analytics
Il y a une suivis par type de projet. Les statistiques sont visible pour les admin enregistrers sur [Google Analytics](https://analytics.google.com) 

1. Les applcations web (Front-end)
2. L'API (Back-end)

### Applications Web
Il y a une déclaration de fonction par app/page. Voir [GoogleAnalyticsObject](https://github.com/Bhacaz/Platforme-Canneberge/search?utf8=%E2%9C%93&q=GoogleAnalyticsObject&type=).

### API
Pour le suivis de l'API, voir : [API/app/routes/analytics.js](https://github.com/Bhacaz/Platforme-Canneberge/blob/master/API/app/routes/analytics.js) 












