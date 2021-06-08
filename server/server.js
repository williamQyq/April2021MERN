
const { MongoClient } = require('mongodb');


async function main() {
    const uri = "mongodb+srv://w:q@cluster0.lkscp.mongodb.net/DB?retryWrites=true&w=majority";

    const client = new MongoClient(uri, {useUnifiedTopology:true});

    try {
        await client.connect();
        
        createListings(client, {
            
        })

    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }


}

main().catch(console.error);

async function createListings(client, newListing) {
    const result = await client.db('DB').collection("listingsAndReviews").insertOne
    (newListing);

    console.log(`new id:`)

}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}