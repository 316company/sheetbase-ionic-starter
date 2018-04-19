export const SHEETBASE_CONFIG = {

    /*
    *   Authentication, using Google API key for public spreadsheet
    * 
    * */
    apiKey: 'AIzaSyC6Rpk_JAZLNc9cp5GxkixfazHdMoYZ8VU', // replace this with your API Key

    /*
    *   Database address, a spreadsheet id
    *
    * */
    database: '1BkCUWPCVWr90xfOTy5bDCDDbw3fD83XNBWCna3J98JY', // replace this with your database ID
    
    /*
    *   Google script web app address, using as backend
    *
    * */
    backend: '', // replace this with you backend ID

    /*
    *   (optional) Custom modifiers, modify the data returned from spreadsheet
    * 
    * */
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