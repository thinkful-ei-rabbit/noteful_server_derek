const path = require('path');
const express = require('express');
const xss = require('xss');
const FolderServices = require('../services/folderServices');

const folderRouter = express.Router();
const serializefolder = (folder) => ({
  id: folder.id,
  folder_name: xss(folder.folder_name)
});

folderRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FolderServices.getAllfolders(knexInstance)
      .then((folders) => {
        res.json(folders.map(serializefolder));
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    if (folder_name == null) {
      return res.status(400).json({
        error: { message: `Missing 'folder_name' in request body` }
      });
    }

    return FolderServices.insertFolder(req.app.get('db'), newFolder)
      .then((folder) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializefolder(folder));
      })
      .catch(next);
  });

folderRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FolderServices.getById(req.app.get('db'), req.params.folder_id)
      .then((folder) => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `folder doesn't exist` }
          });
        }
        res.folder = folder;
        return next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializefolder(res.folder));
  })
  .delete((req, res, next) => {
    FolderServices.deleteById(req.app.get('db'), req.params.folder_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch((req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    const numberOfValues = Object.values(newFolder).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'folder_name'.`
        }
      });

    return FolderServices.updateById(req.app.get('db'), req.params.folder_id, newFolder)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;
