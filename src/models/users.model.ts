// src/models/user.models.ts

import {createHmac } from "crypto";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";



/**
 * Model d'un nouvelle utilisateur
 */

export const NewUserModel = z.object({
    email: z.string().email(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string().transform(val => createHmac('sha256', process.env.API_SECRET || 'secret').update(val).digest('hex')),
    repeated_password: z.string().transform(val => createHmac('sha256', process.env.API_SECRET || 'secret' ).update(val).digest('hex')),
})
.refine(newUser => newUser.password === newUser.repeated_password, {
message: 'Your password not match', });



/**
 * Type d'un nouvelle utilisateur
 */


export type NewUserModelType = z.infer<typeof NewUserModel>

/**
 * Schema d'un nouvelle utilisateur
 */

export const NewUserSchema = zodToJsonSchema(NewUserModel);


/**
 * Model d'un Utilisateur
 */

export const UserModel = z.object({
    _id :  z.preprocess(id => `${id}`, z.string()),
    email: z.string().email(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string(),
});


/**
 *
 * Type d'un utilisateur
 */


export type UserModelType = z.infer<typeof UserModel>

/**
 * Schema d'un utilisateur
 */

export const UserSchema = zodToJsonSchema(UserModel);



/**
 * Model d'une recherche sur des utilisateurs
 */

export const UserSearchCriteriaModel = z.object({
    limit: z.number().min(1).max(100).optional().default(20),
    page: z.number().min(1).optional().default(1),
    orderBy: z.enum(["_id", "email", "firstname", "lastname"]).optional().default("_id"),
    direction: z.enum(["1", "-1"]).optional().default("1"),
    email: z.string().email().optional(),
});


/**
 *
 * Type d'une recherche sur des utilisateurs
 */


export type UserSearchCriteriaModelType = z.infer<typeof UserSearchCriteriaModel>


/**
 * Schema d'une recherche sur des utilisateurs
 */

export const UserSearchCriteriaModelSchema = zodToJsonSchema(UserSearchCriteriaModel);




/**
 * Model d'une liste de users
 */

export const UserCollectionModel = UserModel.array();

/**
 *
 * Type d'une liste de users
 */


export type UserCollectionType = z.infer<typeof UserCollectionModel>


/**
 * Schema d'une liste de users
 */

export const  UserCollectionSchema = zodToJsonSchema(UserCollectionModel);


