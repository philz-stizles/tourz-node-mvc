const Parse = require('csv-parse');
const fs = require('fs');

exports.parseCSVFile = (
  sourceFilePath,
  columns,
  onNewRecord,
  handleError,
  done
) => {
  const source = fs.createReadStream(sourceFilePath);
  // const source = sourceFilePath;

  let linesRead = 0;

  const parser = Parse({
    delimiter: ',',
    columns,
  });

  parser.on('readable', async function () {
    let record;

    // eslint-disable-next-line no-cond-assign
    while ((record = parser.read())) {
      linesRead += 1;
      // eslint-disable-next-line no-await-in-loop
      await onNewRecord(record);
    }
  });

  parser.on('error', function (error) {
    handleError(error);
  });

  parser.on('end', function () {
    done(linesRead);
  });

  source.pipe(parser);
};

exports.parseCSV = () => {
  console.log();
};
