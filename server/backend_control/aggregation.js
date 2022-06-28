import db from '../config/keys';
import keys from '../config/keys';

async function printSuburbs(client, status, maxNumberToPrint) {

    //copy paste aggregation from mongo 
    const pipeline = [];


    client.db(keys.DB).collection(keys.Collections.ProductsPriceListings).aggregate(pipeline);

    const aggCursor = client.db(keys.DB).collection(keys.Collections.ProductsPriceListings).aggregate(pipeline);

    await aggCursor.forEach(productsListing => {
        console.log(`${productsListing._id}:`)
    });
}