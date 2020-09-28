const NoteService = {
    getAllNotes(knex) {
        return knex.select('*').from('note')
    },

    insertNote(knex, newNote) {
        return knex
            .insert(newNote)
            .into('note')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('note')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteById(knex, id) {
        return knex('note')
            .where({ id })
            .delete()
    },

    updateById(knex, id, newNoteFields) {
        return knex('note')
            .where({ id })
            .update(newNoteFields)
    }
}

module.exports = NoteService