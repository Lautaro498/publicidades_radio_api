import { Router } from "express";
import { findAll, findOne, add, update, remove,sanitizeOrderInput,  } from "./order.controler.js";

export const orderRouter = Router()

orderRouter.get('/',  findAll)
orderRouter.get('/:id', findOne)
orderRouter.post('/',sanitizeOrderInput, add)
orderRouter.put('/:id',sanitizeOrderInput, update)
orderRouter.patch('/:id',sanitizeOrderInput, update)
orderRouter.delete('/:id',sanitizeOrderInput, remove)
