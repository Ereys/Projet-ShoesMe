import { FastifyInstance } from "fastify"
import { Code, Collection } from "mongodb";
import { NewUserModel, NewUserSchema, UserCollectionModel, UserCollectionSchema, UserModel, UserModelType, UserSchema, UserSearchCriteriaModel, UserSearchCriteriaModelSchema, UserSearchCriteriaModelType } from "../models/users.model";


export default async function userRoute(app: FastifyInstance) {



    /**
     * Route pour récupérer tous les users
     */

    app.get("/users", {schema: {querystring:UserSearchCriteriaModelSchema, response:{200: UserCollectionSchema}}}
    , async (request, reply) => {
        const querys = UserSearchCriteriaModel.parse(request.query);
        reply.code(200);

        return UserCollectionModel.parse(await app.mongo.db?.
            collection<UserModelType>("users").
            find().
            sort([querys.orderBy, querys.direction]).   // [enum(["_id", "email", "firstname", "lastname"] : enum[1;-1])]
            limit(querys.limit).    // 20 default
            toArray());
    });


    /**
     * Route pour créer un nouveau compte
     */

    app.post("/users", {schema: {body: NewUserSchema, response: {201: UserSchema}}}, async (request, reply) => {
        
        const newUser = NewUserModel.safeParse(request.body);
        if(!newUser.success){
            reply.code(400);
            return "Error: Model not conform";
        }

        /* On ajoute le user à la base de données */

        const resultdb = await app.mongo.db?.collection("users").insertOne({
            email: newUser.data.email,
            firstname: newUser.data.firstname,
            lastname: newUser.data.lastname,
            password: newUser.data.password,
        });

        /* On renvoie l'user qui a été créee avec un code 201 */ 

        reply.code(201);
        return UserModel.parse(await app.mongo.db?.
            collection("users").
            findOne({_id: resultdb?.insertedId}));
    });
}