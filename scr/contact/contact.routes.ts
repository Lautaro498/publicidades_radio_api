import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./contact.controler.js";

export const contactRouter = Router()

contactRouter.get('/', findAll)
contactRouter.get('/:id', findOne)
contactRouter.post('/', add)
contactRouter.put('/:id', update)
contactRouter.patch('/:id', update)
contactRouter.delete('/:id', remove)

