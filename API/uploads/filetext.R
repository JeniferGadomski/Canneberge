run <- function(){ 
setwd('/home/bhacaz/Documents/Platforme-Canneberge/API/app/routes/../file_system_api/fileSystem/5894a2f1df1f28501873a566')
# Créé le : 4/4/2017-16:20:23

library(raster)
library(rgdal)

p <- WebPlot(300,300)

# The id of the ferme : 589b68bf90d51c42998c017d
r <- raster("../589b68bf90d51c42998c017d/Nappe_Blandford_2016-07-13-c.tif")
plot(r)
oprint(r)

out(p)

done()
}