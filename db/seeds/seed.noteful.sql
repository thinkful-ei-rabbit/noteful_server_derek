BEGIN;

TRUNCATE note, folder, note_list RESTART IDENTITY CASCADE;

INSERT INTO note (note_name, description, edit_date)
VALUES
  ('Note 1', 'this is note 1', '9/28/2020')
  ('Note 2', 'this is note 2', '9/29/2020')
  ('Note 3', 'this is note 3', '9/30/2020')
  ('Note 4', 'this is note 4', '9/31/2020')
  ('Note 5', 'this is note 5', '9/32/2020');

INSERT INTO folder (folder_name)
VALUES
  ('folder 1')
  ('folder 2');

INSERT INTO note_list (note_id, folder_id)
VALUES
  (1, 1)
  (2, 1)
  (3, 1)
  (4, 2)
  (5, 2);

COMMIT;