run <- function(){ 
setwd('/home/bhacaz/Documents/Platforme-Canneberge/API/app/routes/../file_system_api/fileSystem/5894a2f1df1f28501873a566')
# Créé le : 20/2/2017-16:24:5

library(jsonlite)
library(httr)


### Aller chercher les donnees
url <- 'api.canneberge.io/api/fermes/589b68bf90d51c42998c017d/weather?simple=true&apiKey=5894a2f1df1f28501873a566' # url de l'api
r <- GET(url) # requete HTTP pour recuperer les donnees
d <- fromJSON(content(r, 'text')) # transforme la reponse en data frame (json -> data frame)

### Utilisation de FastRWeb
p <- WebPlot(600, 300) # Creation dun graphique pour le retour web

library(ggplot2)
library(reshape2)
d <- melt(d, id.vars="day")

# Everything on the same plot
print(ggplot(d, aes(day,value, col=variable)) + 
  geom_point() + 
  stat_smooth())
out(p)

oprint(d) # Printer les donnes de la ferme avec FastRWeb


done()
 }