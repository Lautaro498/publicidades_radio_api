//app.ts

// por que no uso cors (¿nuestra app es libre?) --CODELIC TV: usa el mismo esquema de carpetas
//Nuestra app solo devuelve json, ¿no?
//CORES MIDULAWEN... VIDEOS


import 'reflect-metadata'
import express from "express";
import { contactRouter } from "./contact/contact.routes.js";
import { contractRouter } from './contract/contract.routes.js';
import { shopRouter } from './shop/show.routes.js';
import { orm } from './shared/db/orm.js';
import {RequestContext} from '@mikro-orm/core';
import cors from 'cors';

const PORT = 3001 || process.env.PORT;

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3001'}))

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de la tura y los middlewares de negocio


app.use("/api/contact", contactRouter)
app.use("/api/contract", contractRouter)
app.use("/api/shop", shopRouter)

//RUTA POR DEFECTO CUANDO ESTA MAL LA URL INGRESADA

app.use((_, res) => {
  res.status(404).send({ messege: "Resourse not found" })
})

// LISTEN SERVIDOR

app.listen(PORT, () => {
  console.log("Server running in http:\\localhost:3001")
})