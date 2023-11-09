import { Router } from 'express'
import { sanitizeBlockInput, findAll, findOne, add, update, remove, addAll, removeAll } from './block.controler.js'

export const blockRouter = Router()

blockRouter.get('/', sanitizeBlockInput, findAll)
blockRouter.get('/:id', sanitizeBlockInput, findOne)
blockRouter.post('/all', sanitizeBlockInput, addAll) //CREA TODOS LOS BLOQUES
blockRouter.post('/', sanitizeBlockInput, add)
blockRouter.put('/:id', sanitizeBlockInput, update)
blockRouter.patch('/:id', sanitizeBlockInput, update)
blockRouter.delete('/:id', remove)
blockRouter.delete('/all', removeAll) //BORRA TODOS LOS BLOQUES

