// fileserver
var fileDriver = require('./fsDriver.js');
var url = require('url');
var mime = require('mime');
var path = require('path');
var morgan = require('morgan');
var error = require('debug')('rest-fs:fileserver');
var express = require('express');
var router = express.Router({mergeParams: true});
var authorization = require('../models/authorization');
var fs = require('fs');

/**
 * @api {get} /file/:pathFolder/ Get folder content
 * @apiName Get folder content
 * @apiGroup File
 * @apiDescription Get the content of a folder. The path must end with a '/'
 *
 * @apiPermission apiKey
 *
 * @apiParam {String} pathFolder The path to the folder. Must end with a '/'.
 * @apiSuccess {String[]} list A list of the file and folder in the directory.
 * @apiSuccessExample {json} Response example
 * [
 "/Data/",
 "/Graph/",
 "/ferme_graph.png"
 ]

 @apiError NotFound The folder doesn't exist
 @apiErrorExample {json} Error example
 {
  "errno": -2,
  "code": "ENOENT",
  "path": "/.../45/",
  "message": "ENOENT: no such file or directory, scandir '/.../45/'",
  "stack": "Error: ENOENT: no such file or directory, scandir '/.../45/'\n    at Error (native)"
}
 */
router.get(/^\/(.+\/)?$/, getDir);

/**
 * @api {get} /file/:pathFile Get file
 * @apiName Get file
 * @apiGroup File
 * @apiDescription Get and download a file by its path
 *
 * @apiPermission apiKey
 *
 * @apiParam {String} pathFile The path to the file.
 * @apiSuccess {File} file A stream of the file.
 *
 *  @apiError NotFound The file doesn't exist
 @apiErrorExample {json} Error example
 {
  "errno": -2,
  "code": "ENOENT",
  "path": "/.../45/",
  "message": "ENOENT: no such file or directory, scandir '/.../45/'",
  "stack": "Error: ENOENT: no such file or directory, scandir '/.../45/'\n    at Error (native)"
}
 *
 */
router.get( /^\/.+[^\/]$/, getFile);


/**
 * @api {post} /file/:pathFolder/ Create a folder
 * @apiName Create a folder
 * @apiGroup File
 * @apiDescription Create a new folder. The path must end with a '/'.
 *
 * @apiPermission apiKey
 *
 * @apiParam {String} pathFolder The path to the folder, must end with a '/'.
 * @apiSuccess {String} pathFolder The path of the new folder.
 * @apiSuccessExample {String} Response example
 * /new_Folder/
 */

/**
 * @api {post} /file/:pathFile Upload a file
 * @apiName Upload a file
 * @apiGroup File
 * @apiDescription Upload a file to the specified path.
 *
 * @apiPermission apiKey
 *
 * @apiParam {String} pathFile The path to the file.
 * @apiParam {File} file A raw file as a stream body.
 * @apiSuccess {String} pathFile The path of the new file.
 * @apiSuccessExample {String} Response example
 * /new_Folder/file.txt
 */

/**
 * @api {post} /file/:originalPath Rename or move
 * @apiName Rename or move
 * @apiGroup File
 * @apiDescription Rename or move a file or a folder. The path for a folder must end by a '/'. <br>
 * To rename : the path must be the same and the filename different. <br>
 * To move : the filename must be the same and the path different. <br>
 * The original path and filename is in the url. <br>
 * The new path or filename is set in the <code>body.newPath</code> <br>
 *
 * @apiPermission apiKey
 *
 * @apiParam {String} originalPath The path to the original file or folder.
 * @apiParam {String} newPath The new path or new name of the file-folder.
 */

/**
 * @api {post} /file/:path Get stats
 * @apiName Get stats
 * @apiGroup File
 * @apiDescription Get the stats of a folder or a file.
 *
 * @apiPermission apiKey
 *
 * @apiParam {String} path The path to the file or folder.
 * @apiParam {Boolean} stat Set <code> query.stat=true</code> to get the stats.
 * @apiParamExample {String} Request example
 * /api/file/path/to/file.png?stat=true
 *
 * @apiSuccessExample {json} Response example
 * {
    "dev": 2053,
    "mode": 16893,
    "nlink": 4,
    "uid": 1000,
    "gid": 1000,
    "rdev": 0,
    "blksize": 4096,
    "ino": 2626870,
    "size": 4096,
    "blocks": 8,
    "atime": "2017-04-04T13:29:35.590Z",
    "mtime": "2017-04-03T13:24:58.223Z",
    "ctime": "2017-04-03T13:24:58.223Z",
    "birthtime": "2017-04-03T13:24:58.223Z"
}
 */
router.post( "/*", postFileOrDir);
router.put( "/*", putFileOrDir);

/**
 * @api {delete} /file/:path Delete file or folder
 * @apiName Delete file or folder
 * @apiGroup File
 * @apiDescription Delete a file or a folder by its path. For a folder, the path must end by a '/'.
 *
 * @apiPermission apiKey
 *
 * @apiParam {String} path The path to the file or folder.
 */
router.delete( /^\/.+\/$/, delDir);
router.delete( /^\/.+[^\/]$/, delFile);

var fileSystemDir = function (req) {
    return  __dirname + '/fileSystem/' + (req.params.ferme_id || authorization.getApiFromReq(req));
};


/* GET
  /path/to/dir/
  list contents of directory

  *optional*
  ?recursive = list recursively default false

  return: list of files/dirs
  res.body = [
    {
      "fullFilePath"
    }, ...
  ]
*/
function getDir (req, res, next) {
  if (req.query.stat) {
    return statFile(req, res, next);
  }

  getFilePath(req, function (dirPath) {
      // var dirPath =  decodeURI(url.parse(req.url).pathname);
      var isRecursive = req.query.recursive || "false";
      var opts = req.body.opts;

      var handList = function (err, files) {
          if (err && err.code === 'ENOTDIR') {
              // this this is a file, redirect to file path
              var originalUrl = getOriginalpath(req);
              // var originalUrl = url.parse(req.originalUrl);
              originalUrl.pathname = originalUrl.pathname.substr(0, originalUrl.pathname.length - 1);
              var target = url.format(originalUrl);
              res.statusCode = 303;
              res.setHeader('Location', target);
              return res.end('Redirecting to ' + target);
          }
          if (files) {
              for (var i = files.length - 1; i >= 0; i--) {
                  files[i] = formatOutData(req, files[i]);
              }
          }
          sendCode(200, req, res, next, files)(err);
      };

      if (isRecursive === "true") {
          return fileDriver.listAll({
              dirPath: dirPath,
              opts: opts
          }, handList);
      } else {
          return fileDriver.list({
              dirPath: dirPath,
              opts: opts
          }, handList);
      }
  });

}

/* GET
  /path/to/file
  return contents of file
  if dir, redirect to dir path

  *optional*
  ?encoding = default utf8

  return: data of file
  res.body = {"content of specified file"}
*/
function getFile(req, res, next) {
  if (req.query.stat) {
    return statFile(req, res, next);
  }

    getFilePath(req, function (filePath) {
        // var filePath = decodeURI(url.parse(req.url).pathname);
        var encoding = req.query.encoding || 'utf8';
        var opts = req.body.opts;

        fileDriver.readFile({
            filePath: filePath,
            encoding: encoding,
            opts: opts
        }, function(err, data) {
            if (err && err.code === 'EISDIR') {
                // this this is a dir, redirect to dir path
                var originalUrl = getOriginalpath(req);
                // var originalUrl = url.parse(req.originalUrl);
                originalUrl.pathname += '/';
                var target = url.format(originalUrl);
                res.statusCode = 303;
                res.setHeader('Location', target);
                return res.end('Redirecting to ' + target);
            }
            // console.log(mime.lookup(filePath));
            res.set('Content-Type', mime.lookup(filePath));
            sendCode(200, req, res, next, data)(err);
        });
    });
}

/* POST
  /path/to/file/or/dir
  creates or overwrites file
  creates dir if it does not exisit.
  renames or moves file if newPath exists
  *optional*
  body.newPath = if exist, move/rename file to this location.
  body.clobber = if true will overwrite dest files (default false)
  body.mkdirp = if true will create path to new location (default false)

  body.mode = permissons of file (defaults: file 438(0666) dir 511(0777))
  body.encoding = default utf8

  returns: modified resource
  res.body = {
    "fullFilePath" or dir
  }
*/
 function postFileOrDir(req, res, next) {
     // console.log(req);
    getFilePath(req, function (dirPath) {
        // var dirPath =  decodeURI(url.parse(req.url).pathname);
        var isDir = dirPath.substr(-1) === '/';
        var options = {};
        var isJson = false;
        var opts = req.body.opts;

        if (typeof req.headers['content-type'] === 'string') {
            isJson = ~req.headers['content-type'].indexOf('application/json') === -1 ? true : false;
        }
        // move/rename if newPath exists
        if (req.body.newPath) {
            options.clobber = req.body.clobber || false;
            options.mkdirp = req.body.mkdirp || false;
            var newPath = fileSystemDir(req) + req.body.newPath;
            // console.log(newPath);
            if (isDir && newPath.substr(-1) !== '/') {
                newPath = newPath + '/';
            }
            return fileDriver.move({
                dirPath: dirPath,
                newPath: newPath,
                options: options,
                opts: opts
            }, sendCode(200, req, res, next, formatOutData(req, newPath)));
        }

        if (isDir) {
            var mode = req.body.mode || 511;
            return fileDriver.mkdir({
                dirPath: dirPath,
                mode: mode,
                opts: opts
            }, sendCode(201, req, res, next, formatOutData(req, dirPath)));
        }

        if (!isJson) {
            // default is to not clobber
            options.encoding = req.query.encoding  || 'utf8';
            options.mode = req.query.mode || 438;
            options.flags =  req.query.clobber === 'true' ? 'w' : 'wx';

            return fileDriver.writeFileStream({
                dirPath: dirPath,
                stream: req,
                options: options,
                opts: opts
            }, sendCode(201, req, res, next, formatOutData(req, dirPath)));
        }

        options.encoding = req.body.encoding  || 'utf8';
        options.mode = req.body.mode || 438;
        var data = req.body.content || '';
        fileDriver.writeFile({
            dirPath: dirPath,
            data: data,
            options: options,
            opts: opts
        }, sendCode(201, req, res, next, formatOutData(req, dirPath)));
    });

}

/* PUT
  /path/to/file/or/dir
  make file or dir

  *optional*
  body.mode = permissons of file (438 default 0666 octal)
  body.encoding = default utf8

  returns: modified resource
  res.body = {
    "fullFilePath"
  }
*/
 function putFileOrDir(req, res, next) {
    getFilePath(req, function (dirPath) {
        // var dirPath =  decodeURI(url.parse(req.url).pathname);
        var isDir = dirPath.substr(-1) === '/';
        var options = {};
        var opts = req.body.opts;

        if (isDir) {
            var mode = req.body.mode || 511;
            fileDriver.mkdir({
                dirPath: dirPath,
                mode: mode,
                opts: opts
            }, sendCode(201, req, res, next, formatOutData(req, dirPath)));
        } else {
            options.encoding = req.body.encoding  || 'utf8';
            options.mode = req.body.mode  || 438;
            var data = req.body.content || '';
            fileDriver.writeFile({
                dirPath: dirPath,
                data: data,
                options: options,
                opts: opts
            }, sendCode(201, req, res, next, formatOutData(req, dirPath)));
        }
    });
}

/* DEL
  /path/to/dir/
  deletes dir
  *optional*
  body.clobber = will remove non-empty dir (defaut: false)

  return:
  res.body = {}
*/

function delDir(req, res, next) {
    getFilePath(req, function (dirPath) {
        // var dirPath =  decodeURI(url.parse(req.url).pathname);
        var clobber = req.body.clobber  || false;
        var opts = req.body.opts;

        fileDriver.rmdir({
            dirPath: dirPath,
            clobber: clobber,
            opts: opts
        }, sendCode(200, req, res, next, {}));
    });

}

/* DEL
  /path/to/file
  deletes file

  return:
  res.body = {}
*/

function delFile(req, res, next) {
    getFilePath(req, function (dirPath) {
        // var dirPath =  decodeURI(url.parse(req.url).pathname);
        var opts = req.body.opts;

        fileDriver.unlink({
            dirPath: dirPath,
            opts: opts
        }, sendCode(200, req, res, next, {}));
    });

}

/* GET
  /path/to/dir/or/file
  Returns stats for a file

  return: stats for the file as determined by node
  res.body = {
    dev: 16777220,
    mode: 16877,
    nlink: 31,
    uid: 501,
    gid: 20,
    rdev: 0,
    blksize: 4096,
    ino: 604862,
    size: 1054,
    blocks: 0,
    atime: Thu Mar 05 2015 11:38:47 GMT-0800 (PST),
    mtime: Thu Mar 05 2015 10:52:41 GMT-0800 (PST),
    ctime: Thu Mar 05 2015 10:52:41 GMT-0800 (PST),
    birthtime: Mon Mar 02 2015 10:55:37 GMT-0800 (PST)
  }
*/
function statFile(req, res, next) {
    getFilePath(req, function (filePath) {
        // var filePath = decodeURI(url.parse(req.url).pathname);
        var opts = req.body.opts;

        fileDriver.stat({
            filePath: filePath,
            opts: opts
        }, function(err, stats) {
            sendCode(200, req, res, next, stats)(err);
        });
    });

}

// Helpers

// formats out data based on client spec.
function formatOutData(req, filepath) {
  var out = filepath;
  out = out.replace(fileSystemDir(req), '');
  if (typeof req.modifyOut === 'function') {
    out = req.modifyOut(out);
  }
  return out;
}

function sendCode(code, req, res, next, out) {
    // console.log(code + req + res + out);
  return function (err) {
    if (err) {
      error('ERROR', req.url, err);
      code = 500;
      out = {
        errno: err.errno,
        code: err.code,
        path: err.path,
        message: err.message,
        stack: err.stack
      };

      if (err.code === 'ENOENT') {
        code = 404;
      } if (err.code === 'EPERM') {
        code = 403;
      } if (err.code === 'ENOTDIR' ||
            err.code === 'EISDIR') {
        code = 400;
      } if (err.code === 'ENOTEMPTY' ||
            err.code === 'EEXIST' ||
            err.code === 'EINVAL') {
        code = 409;
      }
    }
    res.status(code).send(out);
  };
}


function getFilePath(req, cb){
    var userFolder = fileSystemDir(req);
    var fullPath = userFolder + decodeURI(url.parse(req.url).pathname);
    fs.mkdir(userFolder, function(err) {
        cb(fullPath);
    });
}

function getOriginalpath(req){
    return url.parse(req.originalUrl);
}

module.exports = router;