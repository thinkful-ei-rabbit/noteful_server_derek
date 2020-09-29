const FolderService = {
  getAllfolders(knex) {
    return knex.select('*').from('folder');
  },

  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into('folder')
      .returning('*')
      .then((rows) => {
        return rows[rows.length - 1];
      });
  },

  getById(knex, id) {
    return knex.from('folder').select('*').where('id', id).first();
  },

  deleteById(knex, id) {
    return knex('folder').where({ id }).delete();
  },

  updateById(knex, id, newfolderFields) {
    return knex('folder').where({ id }).update(newfolderFields);
  }
};

module.exports = FolderService;
