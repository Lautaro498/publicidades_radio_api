import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeShopInput } from "./shop.controler.js";

export const shopRouter = Router()

shopRouter.get('/',sanitizeShopInput,  findAll)
shopRouter.get('/:id',sanitizeShopInput, findOne)
shopRouter.post('/',sanitizeShopInput, add)
shopRouter.put('/:id',sanitizeShopInput, update)
shopRouter.patch('/:id',sanitizeShopInput, update)
shopRouter.delete('/:id', sanitizeShopInput, remove)
