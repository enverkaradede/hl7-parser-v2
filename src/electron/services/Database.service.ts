import Database from 'better-sqlite3';
import path from 'path';

const connect = () => {
  return Database(path.join(__dirname, '../../../', 'release/app', 'hl7.db'), {
    verbose: console.log,
    fileMustExist: false,
  });
};

//* Gonna need that kind of structure later while adding custom fields
// const insertMovieToMoviesTable = (movie: MovieProps) => {
//   const { id, name, year, duration, image, rating } = movie;
//   const db = connect();
//   const smt = db.prepare(
//     'INSERT INTO movies(id, name, year, image, duration, rating, is_watched) VALUES (@id, @name, @year, @image, @duration, @rating, 0)',
//   );

//   return smt.run({ id, name, year, image, duration, rating });
// };

const getVersionList = (): string[] => {
  type DbResult = { id: string };

  const db = connect();
  const stm = db.prepare('SELECT id FROM versions');
  const result: DbResult[] = stm.all() as DbResult[];

  const versionList: string[] = result.map((version: DbResult) => {
    return version.id;
  });

  db.close();
  return versionList;
};

const getSegmentList = (version: string): string[] => {
  type DbResult = { segment_name: string };
  const db = connect();
  const stm = db.prepare(
    'SELECT segment_name FROM segments WHERE version=@version',
  );

  const result: DbResult[] = stm.all({ version }) as DbResult[];

  const segmentList: string[] = result.map((segment: DbResult) => {
    return segment.segment_name;
  });

  db.close();
  return segmentList;
};

const getFieldInfoList = (version: string) => {
  type DbResult = { segment_name: string; fields: string };
  type Hl7FieldInfo = { [key: string]: string };
  type Hl7FieldInfoObj = { [key: string]: Hl7FieldInfo };
  const db = connect();
  const stm = db.prepare(
    'SELECT segment_name, fields FROM segments WHERE version=@version',
  );

  const result: DbResult[] = stm.all({ version }) as DbResult[];

  const fieldInfoObj: Hl7FieldInfoObj = result.reduce(
    (acc, curr) => ({ ...acc, [curr.segment_name]: JSON.parse(curr.fields) }),
    {},
  );

  db.close();
  return fieldInfoObj;
};

const upsertFields = (segment: string, fields: {}, version: string) => {
  type DbResult = { segment_name: string; fields: string };
  const db = connect();
  const stmSel = db.prepare(
    'SELECT segment_name, fields FROM segments WHERE version=@version AND segment_name=@segment',
  );

  const result: DbResult[] = stmSel.all({ version, segment }) as DbResult[];

  if (result.length > 0) {
    const currentFieldsObj = JSON.parse(result[0].fields);
    const newFields = JSON.stringify(
      { ...fields, ...currentFieldsObj },
      null,
      4,
    );
    const smtUpd = db.prepare(
      'UPDATE segments SET fields=@newFields WHERE version=@version AND segment_name=@segment',
    );
    const resultUpd = smtUpd.run({ newFields, version, segment });
    console.log(resultUpd);
    db.close();
    return resultUpd;
  } else {
    fields = JSON.stringify(fields, null, 4);
    const smtIns = db.prepare(
      'INSERT INTO segments(segment_name, fields, version) VALUES(@segment, @fields, @version)',
    );
    const resultIns = smtIns.run({ fields, segment, version });
    console.log(resultIns);
    db.close();
    return resultIns;
  }
};

export { getVersionList, getSegmentList, getFieldInfoList, upsertFields };
