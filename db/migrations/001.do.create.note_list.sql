DROP TABLE IF EXISTS note_list;

CREATE TABLE folder (
  note_id INTEGER REFERENCES note(id) NOT NULL,
  folder_id INTEGER REFERENCES folder(id) NOT NULL,
  PRIMARY KEY (note_id, folder_id)
);