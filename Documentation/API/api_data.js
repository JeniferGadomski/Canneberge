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
          "title": "Resposne-Example",
          "content": "[\n {\n   \"name\": \"Blandford\",\n   \"url\": \"http://carte.canneberge.io/?fermeId=1234567890\"\n }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/route.js",
    "groupTitle": "User"
  }
] });
