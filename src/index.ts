import parse from 'csv-parse/lib/sync';
import fs, {
  PathLike
} from 'fs';
import {
  argv
} from 'process';


export function sort(config: {
  src: PathLike,
  dest ? : PathLike,
  sortColumn: number,
  reverse ? : boolean
}, callback: Function) {


  Promise.all([_sortCSV(config)]).then((values) => {
    callback(values[0]);
  });
}

function _sortCSV(config: {
  src: PathLike,
  dest ? : PathLike,
  sortColumn: number,
  reverse ? : boolean
}) {
  return new Promise((resolve, reject) => {

    fs.readFile(config.src, (err, data) => {

      const firstLine = data.toString().split('\n')[0];
      const delimiter = String.fromCharCode(recognizeDelimiter(data));
      const splittedLine = firstLine.split(delimiter);

      let columns = [];
      for (let i = 0; i < splittedLine.length; i++) {
        columns.push(`${i+1}`);
      }

      const records = parse(data, {
        bom: true,
        // ltrim: true,
        // rtrim: true,
        columns: columns,
        delimiter: delimiter
      })

      const sorted = records.sort((a, b) => {
        if (!config.reverse) {
          return a[config.sortColumn].localeCompare(b[config.sortColumn], undefined, {
            numeric: true,
            sensitivity: 'base'
          })
        } else {
          return b[config.sortColumn].localeCompare(a[config.sortColumn], undefined, {
            numeric: true,
            sensitivity: 'base'
          })
        }
      })
      config.dest ? writeFile(sorted, splittedLine.length) : resolve(sorted);
    })

    function writeFile(sorted, length: number) {
      try {
        for (const elem of sorted) {

          let line = ``;
          for (let i = 0; i < length; i++) {
            if (i === length - 1) {
              line += `${elem[i+1]}`
            } else {
              line += `${elem[i+1]};`
            }
          }
          line += `\n`;
          fs.appendFileSync(config.dest, line)
        }
        resolve(0);
      } catch (err) {
        reject(err)
      }
    }

    function recognizeDelimiter(fileBuffer: Buffer) {
      const delimiters = [',', ';', '|', '\t'];
      const index = delimiters
        .map(function (separator) {
          return fileBuffer.indexOf(separator);
        })
        .reduce(function (p, c) {
          return p === -1 || (c !== -1 && c < p) ? c : p;
        });
      return (fileBuffer[index] || 44);
    }
  })
}

if(argv[2]){
  switch (argv.length) {
    case 2:
      console.error('argument(s) missing');
      break;
    case 3:
      console.error('argument(s) missing');
      break;
    case 4:
      console.error('argument(s) missing');
      break;
    case 5:
      if (!/^\d+$/.test(argv[4])) {
        console.error('sortColumn argument is not UInt');
        break;
      } else _sortCSV({
        src: argv[2],
        dest: argv[3],
        sortColumn: parseInt(argv[4])
      });
      break;
    case 6:
      if (argv[5] === 'true' && /^\d+$/.test(argv[4])) {
        _sortCSV({
          src: argv[2],
          dest: argv[3],
          sortColumn: parseInt(argv[4]),
          reverse: true
        });
      } else if (argv[5] !== 'true' && /^\d+$/.test(argv[4])) {
        _sortCSV({
          src: argv[2],
          dest: argv[3],
          sortColumn: parseInt(argv[4]),
          reverse: false
        });
      } else if (!/^\d+$/.test(argv[4])) {
        console.error('sortColumn argument is not UInt');
      }
      break;
    default:
      break;
  }
}