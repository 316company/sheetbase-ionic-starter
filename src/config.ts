export const CONFIG = {

    /*
    *   Authentication, using Google API key for public spreadsheet
    * 
    * */
    apiKey: '<api_key_here>',

    /*
    *   Database address, a spreadsheet id
    *
    * */
    database: '<spreadsheet_id_here>',
    
    /*
    *   Google script web app address, using as backend
    *
    * */
    backend: '',

    /*
    *   (optional) Custom modifiers, modify the data returned from spreadsheet
    * 
    * */
    modifiers: {

        // for 'post' type data, same as table name
        'posts': (item: any): any => {
            item.greeting = 'Hello, ['+ (item.key || item.slug || item.id) +']! :)'; // add the field 'greeting' to every item has 'post' data
            return item;
        }

    }

}