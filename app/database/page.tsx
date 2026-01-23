import {MongoClient, ServerApiVersion} from 'mongodb'
    
const uri = process.env.MONGODB_URI as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const cursor = await client.db("twitter").collection("users").find();
    const array = await cursor.toArray()
    return array;
  } finally {
    await client.close();
  }
}

export default async function Database() {
    const greetings =  await run();
    return (<>
        {greetings.map(greetingObj=> <h1 key={greetingObj.greeting}>{greetingObj.greeting}</h1>)}
    </>)
  }