export const SHEETBASE_CONFIG = {
    // replace this with your own API Key
    apiKey: 'SUkepreTR52rAhustEju7haYak4ZUhax',    
    // replace with your database
    database: '1BkCUWPCVWr90xfOTy5bDCDDbw3fD83XNBWCna3J98JY',
    // backend id
    backend: 'AKfycbytN8fouXLx-0Yhwwpu3-uXb7fW06ec6mBQFfuslyAZZ-tQvExQ',
    
    // (optional) Google API Key
    googleApiKey: 'AIzaSyC6Rpk_JAZLNc9cp5GxkixfazHdMoYZ8VU',    

    // (optional) Custom modifiers, modify the data returned from spreadsheet
    modifiers: {
        'posts': posts
    }
}



/*
*   Modifier functions
* */
export function posts(item: any): any {
    item.greeting = 'Hello, ['+ (item.key || item.slug || item.id) +']! :)'; // add the field 'greeting' to every item has 'post' data
    return item;
}