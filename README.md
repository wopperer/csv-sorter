# csv-sorter

## What's that?

Naturally sort your CSV files by a column of your choice with delimiter auto recognition.
Save the result into a new sorted .csv file or return an array of objects of sorted records for further manipulation.   
Or use it from the CLI.


## Usage examples:    
\
`npm i csv-sorter`  

```js

const csv = require('csv-sorter');


const config  = {
    src: './Source.csv',
    sortColumn: 1,
    reverse: false,
};

csv.sort(config, (result)=>{
    console.log(JSON.stringify(result)); //array of objects of sorted records for further manipulation
});



//Or to a file:

const config  = {
    src: './Source.csv',
    dest: './Result.csv',
    sortColumn: 1,
    reverse: false
};

csv.sort(config, (result)=>{
    //use your sorted Result.csv file for whatever...
});

```

## Or from CLI:
 
`node ./node_modules/csv-sorter/lib/index.js ./Source.csv ./Dest.csv 1`

    
`node ./node_modules/csv-sorter/lib/index.js ./Source.csv ./Dest.csv 1 true`


Contributers welcome!

 