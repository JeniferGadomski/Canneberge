define({ "api": [
  {
    "type": "post",
    "url": "/authentification",
    "title": "Authentification",
    "name": "Authentification_a_user",
    "group": "Authentification",
    "description": "<p>Authentificate a user with is email and password</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>If the authentification has success.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Authentificaiton message success.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>The api key of the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"success\": true,\n    \"message\": \"Enjoy your token!\",\n    \"apiKey\": \"1234567890\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>Authentication failed. User not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserBlocked",
            "description": "<p>The user is blocked.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UserNotFound-Response",
          "content": "{\n     \"success\": false,\n    \"message\": \"Authentication failed. User not found.\"\n}",
          "type": "json"
        },
        {
          "title": "UserBlocked-Response",
          "content": "{\n     \"success\": false,\n    \"message\": \"Contacter l'administrateur.\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Authentification"
  },
  {
    "type": "post",
    "url": "/fermes",
    "title": "Create a ferme",
    "name": "Create_a_ferme",
    "group": "Ferme",
    "description": "<p>Create a new ferme. Admin only.</p>",
    "permission": [
      {
        "name": "admin",
        "title": "User with administrator authorization",
        "description": "<p>Only the users with the autority admin can use this function</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the ferme.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "geojson",
            "description": "<p>The geosjon of the ferme.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "delete",
    "url": "/fermes/:id",
    "title": "Delete ferme",
    "name": "Delete_ferme",
    "group": "Ferme",
    "description": "<p>Delete the ferme from the database.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "get",
    "url": "/fermes",
    "title": "Get all ferme",
    "name": "Get_all_ferme",
    "group": "Ferme",
    "description": "<p>Get all ferme information. Admin only.</p>",
    "permission": [
      {
        "name": "admin",
        "title": "User with administrator authorization",
        "description": "<p>Only the users with the autority admin can use this function</p>"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>List of ferme object</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "get",
    "url": "/fermes/:id/file/:path",
    "title": "Ferme file",
    "name": "Get_ferme",
    "group": "Ferme",
    "description": "<p>See the section <a href=\"#api-File\">File</a>. The only difference is the url to use. <br> Replace <code>/file/:path</code> by <code>/fermes/:id/file/:path</code></p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<p>The path to the file or the folder.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request example",
          "content": "/api/fermes/1234567890/file/path/to/file.png",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "get",
    "url": "/fermes/:id",
    "title": "Get ferme",
    "name": "Get_ferme",
    "group": "Ferme",
    "description": "<p>Get ferme informations in a object</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "weather",
            "defaultValue": "true",
            "description": "<p>If false, doesn't return the weather.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "weather=false",
          "content": "/api/fermes/:id?=weather=false",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ferme",
            "description": "<p>Object with the information of the ferme</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ferme._id",
            "description": "<p>The id of the ferme.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ferme.name",
            "description": "<p>The name of the ferme</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ferme.geojson",
            "description": "<p>The geosjon of the shapefile of the ferme</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ferme.centerCoordinate",
            "description": "<p>The coordinate of the center of the ferme</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ferme.centerCoordinate.lat",
            "description": "<p>The latitide.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ferme.centerCoordinate.lng",
            "description": "<p>The longitude.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "ferme.rasters",
            "description": "<p>List of object with the information of the raster, see <a href=\"#api-Rasters-Get_all_info\">Rasters</a></p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "ferme.markers",
            "description": "<p>List of the markers to show on map</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ferme.markers.title",
            "description": "<p>Title of the markers</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ferme.markers.note",
            "description": "<p>Note of the markers</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ferme.markers.id",
            "description": "<p>Id of the markers</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ferme.markers.latLng",
            "description": "<p>Object with the <code>latLng.lat</code> and <code>latLng.lng</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "weather",
            "description": "<p>The data of the weather for the location of the ferme.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example response",
          "content": "<a href=\"example.html#example-ferme\">Example Ferme</a>",
          "type": "html"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "get",
    "url": "/fermes/:id/data",
    "title": "Get ferme data",
    "name": "Get_ferme_data",
    "group": "Ferme",
    "description": "<p>Retrive only the data / attribut of the shapefile of the ferme in a list of Object.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>List of object of every attribut of the ferme shapefile</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response-Example",
          "content": "<a href=\"example.html#example-ferme-data\">Example ferme data</a>",
          "type": "html"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "get",
    "url": "/fermes/:id/weather",
    "title": "Get ferme weather",
    "name": "Get_ferme_weather",
    "group": "Ferme",
    "description": "<p>Get the weather at the location of the ferme.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "simple",
            "defaultValue": "false",
            "description": "<p>If simple return only a list of certain data of the weather</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Resquest simple example",
          "content": "/api/fermes/:id/weather?simple=true",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "forecast",
            "description": "<p>The data object for the forecast weather</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "forecast.simpleforecast",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "forecast.simpleforecast.forecastday",
            "description": "<p>A list of the data for today to today + 3 day</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "current_observation",
            "description": "<p>The data of the current observation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "simple=false",
          "content": "<a href=\"example.html#example-weather\">Example weather</a>",
          "type": "html"
        },
        {
          "title": "simple=true",
          "content": "<a href=\"example.html#example-weather-simple\">Example weather simple</a>",
          "type": "html"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "put",
    "url": "/fermes/:id",
    "title": "Update ferme",
    "name": "Update_ferme",
    "group": "Ferme",
    "description": "<p>Upadte ferme informations</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>The body must have the structure like the object ferme of <a href=\"#api-Ferme-Get_ferme\">Get ferme</a>.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "put",
    "url": "/fermes/:id/data",
    "title": "Update ferme data",
    "name": "update_ferme_data",
    "group": "Ferme",
    "description": "<p>Update the shapefile data with a list of Object. Must put the entier data. The function doesn't merge the data on the database, <strong>it replace it</strong>.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>List of object that represent the data. <strong> Must have the same lenght of features </strong></p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>OK</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "LenghtOfData",
            "description": "<p>doesn't match</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Lenght data error",
          "content": "{\"success\" : false, \"message\" : \"Le nombre de ligne de 'data' ne concorde pas\"}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Ferme"
  },
  {
    "type": "post",
    "url": "/file/:pathFolder/",
    "title": "Create a folder",
    "name": "Create_a_folder",
    "group": "File",
    "description": "<p>Create a new folder. The path must end with a '/'.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pathFolder",
            "description": "<p>The path to the folder, must end with a '/'.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "pathFolder",
            "description": "<p>The path of the new folder.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response example",
          "content": "/new_Folder/",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/file_system_api/fileserver.js",
    "groupTitle": "File"
  },
  {
    "type": "delete",
    "url": "/file/:path",
    "title": "Delete file or folder",
    "name": "Delete_file_or_folder",
    "group": "File",
    "description": "<p>Delete a file or a folder by its path. For a folder, the path must end by a '/'.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<p>The path to the file or folder.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/file_system_api/fileserver.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/file/:pathFile",
    "title": "Get file",
    "name": "Get_file",
    "group": "File",
    "description": "<p>Get and download a file by its path</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pathFile",
            "description": "<p>The path to the file.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>A stream of the file.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The file doesn't exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error example",
          "content": " {\n  \"errno\": -2,\n  \"code\": \"ENOENT\",\n  \"path\": \"/.../45/\",\n  \"message\": \"ENOENT: no such file or directory, scandir '/.../45/'\",\n  \"stack\": \"Error: ENOENT: no such file or directory, scandir '/.../45/'\\n    at Error (native)\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/file_system_api/fileserver.js",
    "groupTitle": "File"
  },
  {
    "type": "get",
    "url": "/file/:pathFolder/",
    "title": "Get folder content",
    "name": "Get_folder_content",
    "group": "File",
    "description": "<p>Get the content of a folder. The path must end with a '/'</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pathFolder",
            "description": "<p>The path to the folder. Must end with a '/'.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "list",
            "description": "<p>A list of the file and folder in the directory.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response example",
          "content": "[\n \"/Data/\",\n \"/Graph/\",\n \"/ferme_graph.png\"\n ]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The folder doesn't exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error example",
          "content": " {\n  \"errno\": -2,\n  \"code\": \"ENOENT\",\n  \"path\": \"/.../45/\",\n  \"message\": \"ENOENT: no such file or directory, scandir '/.../45/'\",\n  \"stack\": \"Error: ENOENT: no such file or directory, scandir '/.../45/'\\n    at Error (native)\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/file_system_api/fileserver.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/file/:path",
    "title": "Get stats",
    "name": "Get_stats",
    "group": "File",
    "description": "<p>Get the stats of a folder or a file.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<p>The path to the file or folder.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "stat",
            "description": "<p>Set <code> query.stat=true</code> to get the stats.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request example",
          "content": "/api/file/path/to/file.png?stat=true",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response example",
          "content": "{\n    \"dev\": 2053,\n    \"mode\": 16893,\n    \"nlink\": 4,\n    \"uid\": 1000,\n    \"gid\": 1000,\n    \"rdev\": 0,\n    \"blksize\": 4096,\n    \"ino\": 2626870,\n    \"size\": 4096,\n    \"blocks\": 8,\n    \"atime\": \"2017-04-04T13:29:35.590Z\",\n    \"mtime\": \"2017-04-03T13:24:58.223Z\",\n    \"ctime\": \"2017-04-03T13:24:58.223Z\",\n    \"birthtime\": \"2017-04-03T13:24:58.223Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/file_system_api/fileserver.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/file/:originalPath",
    "title": "Rename or move",
    "name": "Rename_or_move",
    "group": "File",
    "description": "<p>Rename or move a file or a folder. The path for a folder must end by a '/'. <br> To rename : the path must be the same and the filename different. <br> To move : the filename must be the same and the path different. <br> The original path and filename is in the url. <br> The new path or filename is set in the <code>body.newPath</code> <br></p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "originalPath",
            "description": "<p>The path to the original file or folder.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPath",
            "description": "<p>The new path or new name of the file-folder.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/file_system_api/fileserver.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/file/:pathFile",
    "title": "Upload a file",
    "name": "Upload_a_file",
    "group": "File",
    "description": "<p>Upload a file to the specified path.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pathFile",
            "description": "<p>The path to the file.</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>A raw file as a stream body.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "pathFile",
            "description": "<p>The path of the new file.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response example",
          "content": "/new_Folder/file.txt",
          "type": "String"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/file_system_api/fileserver.js",
    "groupTitle": "File"
  },
  {
    "type": "post",
    "url": "/executeR",
    "title": "Execute R code",
    "name": "Execute_R_code",
    "group": "R",
    "description": "<p>Execute a R code and print the output <a href=\"http://r.canneberge.io/filetext\">r.canneberge.io</a></p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filetext",
            "description": "<p>The string of the script to execute</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "R"
  },
  {
    "type": "post",
    "url": "/fermes/:id/rasters/:name",
    "title": "Add raster",
    "name": "Add_raster",
    "group": "Rasters",
    "description": "<p>Create a new raster for the ferme.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The name of the raster</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "date",
            "defaultValue": "today",
            "description": "<p>The time (milliseconds) since 1 janv. 1970</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>A raw file as stream of a .tif file.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request example",
          "content": "/api/fermes/1234567890/rasters/My_New_Raster?date=14022465698",
          "type": "String"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoStreamFile",
            "description": "<p>The body must be a raw stream</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/rasters.js",
    "groupTitle": "Rasters"
  },
  {
    "type": "delete",
    "url": "/fermes/:id/rasters/:raster_id",
    "title": "Delete raster",
    "name": "Delete_raster",
    "group": "Rasters",
    "description": "<p>Delete the raster, info, tif and png from the server.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "raster_id",
            "description": "<p>The id of the raster</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ErrorDelete",
            "description": "<p>Error deleting a rasters</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/rasters.js",
    "groupTitle": "Rasters"
  },
  {
    "type": "get",
    "url": "/fermes/:id/rasters",
    "title": "Get all rasters info",
    "name": "Get_all_info",
    "group": "Rasters",
    "description": "<p>Get all rasters object of a ferme.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>List of rasters object</p>"
          },
          {
            "group": "Success 200",
            "type": "Stinng",
            "optional": false,
            "field": "list._id",
            "description": "<p>Id of the raster</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "list.date",
            "description": "<p>Object with two format for the date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "list.date.string",
            "description": "<p>The date formated dd MMMM YYYY</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "list.date.time",
            "description": "<p>The number of milliseconds since 1 janv 1970</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "list.path",
            "description": "<p>Object containing the url for the api to get the files</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "list.path.tif",
            "description": "<p>Url for the tif file</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "list.path.png",
            "description": "<p>Url for the png file</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "list.bounds",
            "description": "<p>With <code> .north .south .west .east</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "list.band",
            "description": "<p>With <code> .min .max .mean </code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success example",
          "content": "<a href=\"example.html#example-rasters\">Example rasters</a>",
          "type": "html"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/rasters.js",
    "groupTitle": "Rasters"
  },
  {
    "type": "get",
    "url": "/fermes/:id/rasters/:raster_id.type",
    "title": "Get raster file",
    "name": "Get_raster_file",
    "group": "Rasters",
    "description": "<p>Get the file of a raster. Valid option .png or .tif</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "raster_id",
            "description": "<p>The id of the raster</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>The type of the file. Only : <code>.png</code>, <code>.tif</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request example png",
          "content": "/api/fermes/1234567890/rasters/14022465698.png",
          "type": "String"
        },
        {
          "title": "Request example tif",
          "content": "/api/fermes/1234567890/rasters/14022465698.tif",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>A stream of the file.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRasterId",
            "description": "<p>No raster found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadFileExtension",
            "description": "<p>Bad extension, must be .png or .tif</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/rasters.js",
    "groupTitle": "Rasters"
  },
  {
    "type": "get",
    "url": "/fermes/:id/rasters/:raster_id",
    "title": "Get raster info",
    "name": "Get_raster_info",
    "group": "Rasters",
    "description": "<p>Get the informations of a raster by its id in a object.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "fermeAccess",
        "title": "User with the right to access the farm",
        "description": "<p>Only the users with the autority to access this farm can access it.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the ferme</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "raster_id",
            "description": "<p>The id of the raster</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request example",
          "content": "/api/fermes/1234567890/rasters/14022465698",
          "type": "String"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>A object with the info of the raster. See :  <a href=\"#api-Rasters-Get_all_info\">Get all rasters</a></p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRasterId",
            "description": "<p>No raster found</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/rasters.js",
    "groupTitle": "Rasters"
  },
  {
    "type": "post",
    "url": "/shapefile-to-geojson",
    "title": "Convert Shapefile",
    "name": "Convert_Shapefile_to_geosjson",
    "group": "Shapefile",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "description": "<p>Convert a shapefile</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "shapefileZip",
            "description": "<p>A zip file with .shp, .dbf, and .shx (.prj optionnel) en form-data</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "sourceSrs",
            "defaultValue": "26918",
            "description": "<p>The projection of the shapefile</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request example",
          "content": "/api/shapefile-to-geojson?=sourceSrs=4326",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Geojson",
          "content": "<a href=\"example.html#example-geojson\">Example geojson</a>",
          "type": "html"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Shapefile"
  },
  {
    "type": "post",
    "url": "/geojson-to-shapefile",
    "title": "Convert GeoJSON",
    "name": "Convert_a_GeoJSON_to_a_shapefile",
    "group": "Shapefile",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "description": "<p>Convert a GeoJSON</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "geojson",
            "description": "<p>The geojson object to convert</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "file",
            "description": "<p>A stream witch content a zip file of the shapefile (EPSG:4326)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Shapefile"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create a new user",
    "name": "Create_a_new_user",
    "group": "User",
    "description": "<p>Create and register a new user.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>First name of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastname",
            "description": "<p>Last name of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Last name of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "defaultValue": "default",
            "description": "<p>The password of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "scripts",
            "defaultValue": "[]",
            "description": "<p>List of the scripts. Only admin can have some.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "authorization",
            "description": "<p>Value to restrict user.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "authorization.admin",
            "defaultValue": "false",
            "description": "<p>Param to set a user admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "authorization.blocked",
            "defaultValue": "true",
            "description": "<p>The user can't use the API when true.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "authorization.fermes",
            "defaultValue": "[]",
            "description": "<p>List of the farms the user have access.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Successful created new user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"success\": true,\n  \"message\": \"Successful created new user.\",\n  \"user\": {\n    \"__v\": 0,\n    \"username\": \"Postman\",\n    \"firstname\": \"Post\",\n    \"lastname\": \"Man\",\n    \"email\": \"postman@gmail.com\",\n    \"_id\": \"1234567980\",\n    \"authorization\": {\n      \"blocked\": true,\n      \"fermes\": [],\n      \"admin\": false\n    },\n    \"scripts\": [],\n    \"password\": \"1234567980\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Error",
            "description": "<p>Message detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response",
          "content": "{\n     \"success\": false,\n    \"message\": \"User validation failed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/users/:id",
    "title": "Delete User",
    "name": "Delete_User",
    "group": "User",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "sameUser",
        "title": "User must be admin or by the same user",
        "description": "<p>Only admin or user himself can acces to the user.</p>"
      }
    ],
    "description": "<p>Delete a user by it's id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The user id.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Code",
            "description": "<p>Status message</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Get User",
    "name": "Get_User",
    "group": "User",
    "description": "<p>Get the information of an user.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "sameUser",
        "title": "User must be admin or by the same user",
        "description": "<p>Only admin or user himself can acces to the user.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>Object user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.firstname",
            "description": "<p>First name of the new user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.lastname",
            "description": "<p>Last name of the new user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.email",
            "description": "<p>Last name of the new user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.password",
            "description": "<p>The password of the new user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.username",
            "description": "<p>The username of the new user</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "user.scripts",
            "defaultValue": "[]",
            "description": "<p>List of the scripts. Only admin can have some.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user.authorization",
            "description": "<p>Value to restrict user.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "user.authorization.admin",
            "defaultValue": "false",
            "description": "<p>Param to set a user admin.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "user.authorization.blocked",
            "defaultValue": "true",
            "description": "<p>The user can't use the API when true.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "user.authorization.fermes",
            "defaultValue": "[]",
            "description": "<p>List of the farms the user have access.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"user\": {\n    \"_id\": \"1234567980\",\n    \"firstname\": \"PostMan\",\n    \"lastname\": \"Pampev\",\n    \"email\": \"pampev@gmail.com\",\n    \"username\": \"pampev\",\n    \"__v\": 0,\n    \"authorization\": {\n      \"blocked\": false,\n      \"fermes\": [\n        {\n          \"_id\": \"1234567980\",\n          \"name\": \"Pampev\"\n        }\n      ],\n      \"admin\": false\n    },\n    \"scripts\": [],\n    \"password\": \"1234567980\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The user doesn't exist.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response",
          "content": "{\n  \"message\": \"no user\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get all user",
    "name": "Get_all_user",
    "group": "User",
    "permission": [
      {
        "name": "admin",
        "title": "User with administrator authorization",
        "description": "<p>Only the users with the autority admin can use this function</p>"
      }
    ],
    "description": "<p>Retrive all users</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>List of all users</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/users/:id",
    "title": "Update User",
    "name": "Update_User",
    "group": "User",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "sameUser",
        "title": "User must be admin or by the same user",
        "description": "<p>Only admin or user himself can acces to the user.</p>"
      }
    ],
    "description": "<p>Update a user by it's id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "firstname",
            "description": "<p>First name of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "lastname",
            "description": "<p>Last name of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Email of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "defaultValue": "default",
            "description": "<p>The password of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "username",
            "description": "<p>The username of the new user</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": true,
            "field": "scripts",
            "defaultValue": "[]",
            "description": "<p>List of the scripts. Only admin can have some.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "authorization",
            "description": "<p>Value to restrict user.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "authorization.admin",
            "defaultValue": "false",
            "description": "<p>Param to set a user admin.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "authorization.blocked",
            "defaultValue": "true",
            "description": "<p>The user can't use the API when true.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": true,
            "field": "authorization.fermes",
            "defaultValue": "[]",
            "description": "<p>List of the farms the user have access.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>The object of the user updated.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"user\": Object\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Error",
            "description": "<p>Message detail</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response",
          "content": "{\n  \"success\": false,\n  \"message\": \"Error no user found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id/redirections",
    "title": "User redirections",
    "name": "User_redirections",
    "group": "User",
    "description": "<p>Get all link of application the user has access.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      },
      {
        "name": "sameUser",
        "title": "User must be admin or by the same user",
        "description": "<p>Only admin or user himself can acces to the user.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "list",
            "description": "<p>List of the link with title.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": ".name",
            "description": "<p>Title of the link.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": ".url",
            "description": "<p>The url of the link.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Reponse-Example",
          "content": "[\n {\n   \"name\": \"Blandford\",\n   \"url\": \"http://carte.canneberge.io/?fermeId=1234567890\"\n }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/weather",
    "title": "Get weather latLng",
    "name": "Get_weather_latLng",
    "group": "Weather",
    "description": "<p>Get the current weather condition and the forecast with latitude and longitude.</p>",
    "permission": [
      {
        "name": "apiKey",
        "title": "The user must provide a api key",
        "description": "<p>header : {x-access-token : apiKey}, body : {apiKey : apiKey}, query : ?apiKey=apiKey</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "lat",
            "description": "<p>The latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "lng",
            "description": "<p>The longitude</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "simple",
            "description": "<p>If <code>true</code> return only a array on forecast data.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request example",
          "content": "/api/weather?lat=46.123&lng=-72.123",
          "type": "String"
        },
        {
          "title": "Request example simple",
          "content": "/api/weather?lat=46.123&lng=-72.123&simple=true",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Response Example",
          "content": "<a href=\"example.html#example-weather\">Example weather</a>",
          "type": "html"
        },
        {
          "title": "Response Example simple",
          "content": "<a href=\"example.html#example-weather-simple\">Example weather simple</a>",
          "type": "html"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "Weather"
  }
] });
