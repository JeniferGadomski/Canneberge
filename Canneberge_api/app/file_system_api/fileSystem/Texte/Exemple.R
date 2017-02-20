# Créé le : 16/2/2017-14:6:39

library(jsonlite)
library(httr)


### Aller chercher les donnees
url <- 'localhost:8080/api/fermes/data?fermeName=Blandford' # url de l'api
r <- GET(url) # requete HTTP pour recuperer les donnees
fermeData <- fromJSON(content(r, 'text')) # transforme la reponse en data frame (json -> data frame)

### Utilisation de FastRWeb
p <- WebPlot(600, 300) # Creation dun graphique pour le retour web
barplot(fermeData$Exp, names = fermeData$Name, 
  xlab = "Nom champs", ylab = "Hauteur nappe",
  main = "Hauteur de nappe d'une ferme",
  col=ifelse(fermeData$Exp>300,"red","blue")) # Creation du graphique
out(p) # Imprimer le graphique sur le rendu web



fermeData[1, 1] <- 123456789 # Changer une donnee de la ferme
oprint(fermeData) # Printer les donnes de la ferme avec FastRWeb


# Enregistrer les nouvelles donnees
oprint(PUT(url, body = list(data = fermeData), encode = 'json'))

done()
