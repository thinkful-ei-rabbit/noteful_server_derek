const path = require('path')
const express = require('express')
const xss = require('xss')
const NoteService = require('../services/note-service')

const noteRouter = express.Router()
const serializeNote = note => ({
  id: note.id,
  notename: xss(note.notename),
  description: xss(note.description),
  edit_date: note.edit_date,
})

noteRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NoteService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })
  .post((req, res, next) => {
    const { note_name, description, edit_date } = req.body
    const newNote = { note_name, description, edit_date }

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

   NoteService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note))
      })
      .catch(next)
  })

noteRouter
  .route('/:note_id')
  .all((req, res, next) => {
    NoteService.getById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `note doesn't exist` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializeNote(res.note))
  })
  .delete((req, res, next) => {
    NoteService.deletenote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch((req, res, next) => {
    const { note_name, description, edit_date } = req.body
    const newNote = { note_name, description, edit_date }

    const numberOfValues = Object.values(newNote).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'note_name', 'description', or 'edit_date'`
        }
      })

    NoteService.updatenote(
      req.app.get('db'),
      req.params.note_id,
      newNote
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = noteRouter