import fastify from 'fastify'
import fastifyPlugin from "fastify-plugin";
import mongodb from '@fastify/mongodb'
import userRoute from './routes/users.route'
import fastifyJwt from '@fastify/jwt';

// Création d'une application fastify
const app = fastify({ logger: true })

// Je connécte une base de données
app.register(mongodb, {
  url: process.env.DATABASE_URL,
  database: 'ShoesMeDatabase',
})
 
// On connecte le plugin ./routes/users.route.ts

app.register(fastifyPlugin(userRoute));

// On connecte le plugin JWT pour les tokens


app.register(require("@fastify/jwt"),{secret: process.env.SECRET_TOKEN});

// Démarage du serveur http
app.listen({ port: 5353, host: '127.0.0.1' }, () => {
  console.log("Le serveur http est prêt sur l'adresse : http://127.0.0.1:5353")
})
