//Port
process.env.PORT = process.env.PORT || 3004;

//La firma del token
process.env.SEED = process.env.SEED || "esta_es_la_firma";

//La fecha de expiracion del token
process.env.EXPIRACION = "3650d";

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

let urlDB;

if (process.env.MODE_ENV === "dev") {
	urlDB = "mongodb://f54f16438c397f47d91252f4e107dab6:kakaroto@17a.mongo.evennode.com:27031,17b.mongo.evennode.com:27031/f54f16438c397f47d91252f4e107dab6?replicaSet=eu-17"
  // urlDB = "mongodb://cd33f158f7d156db5c4d19347a369366:kaka8596@12a.mongo.evennode.com:27018,12b.mongo.evennode.com:27018/cd33f158f7d156db5c4d19347a369366?replicaSet=us-12"
} else {
	urlDB = "mongodb://f54f16438c397f47d91252f4e107dab6:kakaroto@17a.mongo.evennode.com:27031,17b.mongo.evennode.com:27031/f54f16438c397f47d91252f4e107dab6?replicaSet=eu-17"
	// urlDB = "mongodb://cd33f158f7d156db5c4d19347a369366:kaka8596@12a.mongo.evennode.com:27018,12b.mongo.evennode.com:27018/cd33f158f7d156db5c4d19347a369366?replicaSet=us-12"
}

process.env.URLDB = urlDB;


