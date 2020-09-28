const FolderService = {
    getAllFolders(knex) {
        return knex.select('*').from('note')
    },

    insertFolder(knex, newFolder) {
        return knex
            .insert(newFolder)
            .into('folder')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getByFolderId(knex, id) {
        return knex
            .from('folder')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteFolder(knex, id) {
        return knex('folder')
            .where({ id })
            .delete()
    },

    updateFolder(knex, id, newfolderFields) {
        return knex('folder')
            .where({ id })
            .update(newfolderFields)
    }
}

module.exports = FolderService