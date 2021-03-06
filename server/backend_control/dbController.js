import pkg from 'mongodb';
const {MongoClient} = pkg;

import dotenv from 'dotenv'
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path:__dirname+"/./.env"});   //secrete keys in environment


const mongoURI = process.env.DB_URI
const COL_BESTBUY = process.env.DB_COLLECTION_BESTBUY
const COL_AMZ_PROD_PRICING = process.env.DB_COLLECTION_AMZ_PROD_PRICING
const COL_ITEMSPEC = process.env.DB_COLLECTION_ITEMSPEC

(async ()=>{
    const client = new MongoClient(mongoURI, {useUnifiedTopology: true, useNewUrlParser: true});
    try {
        await client.connect();
        const db = client.db("DB");
        // const testdb = client.db("Product_Info")

        const query = {
            "upc":{$exists:true}
        }

        const doc = await db.collection(COL_AMZ_PROD_PRICING).deleteMany(query)
        // const doc = await testdb.collection("Pc_info").findOneAndUpdate(query,update)
        console.log(JSON.stringify(doc,null,4))

    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
})();


// //CRUD - create
// // async function createMultipleListings(client, newListings) {
// //     const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings)
// //     .insertMany(newListings);
// //     console.log(`${result.insertedCount} new Listings created with the following id(s):`);
// //     console.log(result.insertedIds);
// // }

// // async function createListing(client, newListing) {
// //     const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings)
// //     .insertOne(newListing);

// //     console.log(`New listing created with the following id: ${result.insertedId}`);

// // }

// // //CRUD - read
// // async function findOneListingByName(client, nameOfListing) {
// //     const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings)
// //     .findOne({name: nameOfListing});
    
// //     if (result){
// //         console.log(`Found a listing in the collection with the name '
// //         ${nameOfListing}'`);
// //         console.log(result);
// //     } else {
// //         console.log(`No listings found with the name '${nameOfListing}'`);
// //     }
// // }

// // async function findListingsWithActiveStatus
// // (client, {
// //     status = "inactive",
// //     maximumNumberOfResults = Number.MAX_SAFE_INTEGER
// // } = {}) {

// //     const cursor = client.db(keys.DB).collection(keys.Collections.ProductsPriceListings).find({
// //         status: status
// //     }).limit(maximumNumberOfResults);

// //     const results = await cursor.toArray();

// //     if(results.length>0) {
// //         console.log(`Found listing(s) with status: ${status}`);
// //         results.forEach((result,i) => {
// //             date = new Date(result.last_review).toDateString();
// //             console.log();
// //             console.log(`${i+1}.name: ${result.name}`);
// //             console.log(`   status: ${result.status}`);
// //             console.log(`   price: ${result.price}`);
// //             console.log(`   most recent last review date: ${new Date(result.last_review).toDateString()}`);
// //         });
// //     }
// // }

// // //CRUD -- update
// // async function updateListingByName(client, nameOfListing, updatedListing) {
// //     const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings).updateOne({ name: 
// //         nameOfListing},{ $set: updatedListing});
    
// //     console.log(`${result.matchedCount} document(s) matched the query criteria`);
// //     console.log(`${result.modifiedCount} documents were updated`);
// // }

// // async function upsertListingByName(client, nameOfListing, updatedListing) {
// //     const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings).updateOne({ name: 
// //         nameOfListing},{ $set: updatedListing}, {upsert: true});
    
// //     console.log(`${result.matchedCount} document(s) matched the query criteria`);

// //     if (result.upsertedCount >0){
// //         console.log(`One document was inserted with the id ${result.upsertedId}`);
// //     } else {
// //         console.log(`${result.modifiedCount} document(s) was/were updated`);
// //     }
        
// // }

// // async function updateAllListingsToHaveStatus(client) {
// //     const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings)
// //     .updateMany({ status:{ $exists: false}},
// //         { $set: { status: "unknow"}});

// //     console.log(`${result.matchedCount} document(s) matched the query criteria`);
// //     console.log(`${result.modifiedCount} document(s) was/were updated`);

// // }

// // //CRUD --delete
// // async function deleteListingByName(client, nameOfListing) {
// //     const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings)
// //     .deleteOne({ name: nameOfListing});

// //     console.log(`${result.deletedCount} document(s) was/were deleted`);
// // }

// // async function deleteListings(client, date) {
// //     const result = await client.db(keys.DB).collection(keys.Collections.ProductsPriceListings)
// //     .deleteMany({ "date": { $lt: date}});

// //     console.log(`${result.deletedCount} document(s) was/were deleted`);
// // }

// // async function listDatabases(client) {
// //     const databasesList = await client.db().admin().listDatabases();

// //     console.log("Databases:");
// //     databasesList.databases.forEach(db => {
// //         console.log(`- ${db.name}`);
// //     })
// // }