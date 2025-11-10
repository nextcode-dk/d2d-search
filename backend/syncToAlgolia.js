import algoliasearch from "algoliasearch";
import Trip from "./models/Trip.js";
import dotenv from "dotenv";

dotenv.config();

const APP_ID = process.env.ALGOLIA_APP_ID;
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const INDEX_NAME = process.env.ALGOLIA_INDEX || "carriers_trips";

if (!APP_ID || !ADMIN_KEY) {
  console.warn("Algolia keys missing. Sync will be skipped until they are provided in .env");
}

const client = APP_ID && ADMIN_KEY ? algoliasearch(APP_ID, ADMIN_KEY) : null;
const index = client ? client.initIndex(INDEX_NAME) : null;

export async function syncTripsToAlgolia() {
  if (!index) return;
  const trips = await Trip.find();
  const objects = trips.flatMap(trip =>
    trip.routes.map(route => ({
      objectID: `${trip._id}-${route.dayOfWeek}-${route.startCountry}-${route.endCountry}`,
      company: trip.company,
      startCountry: route.startCountry,
      endCountry: route.endCountry,
      dayOfWeek: route.dayOfWeek,
      contact: trip.contact,
      profileImage: trip.profileImage
    }))
  );
  if (objects.length === 0) {
    await index.clearObjects();
    console.log("Algolia: cleared objects (0 found)");
    return;
  }
  await index.saveObjects(objects);
  console.log(`🔄 Synced ${objects.length} routes to Algolia (${INDEX_NAME})`);
}
