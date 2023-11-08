
import { Request, Response, NextFunction } from 'express'
import { Block } from './block.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
em.getRepository(Block)


function sanitizeBlockInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    number: req.body.number,
    startTime: req.body.startTime
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
    try {
        const blocks = await em.find(Block, {}) //no pongo contrataciones porque no esta desarrollada
        res.status(200).json({message: 'Find all Blocks', data: blocks})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
  }


async function findOne(req: Request, res: Response) {
     try {
        const id = req.params.id
        const blocks = await em.findOneOrFail(Block, {id})
        res.status(200).json({message: 'Block founded', data: blocks})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    
}


async  function add(req: Request, res: Response) {
     try {
        //Preguntar como hacer las validaciones. Supongo que con funciones externas.
        const blocks = em.create(Block, req.body.sanitizeInput) //DEBERIA VALIDAR QUE EXISTA EL COMERCIO
        await em.flush() //seria como el save. Persiste. 
        res.status(200).json({message: 'Block created sucesfully', data: blocks})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
    try {
        const id = req.params.id
        const blockToUpdate = await em.findOneOrFail(Block, {id})
        em.assign(blockToUpdate, req.body.sanitizeInput) //deberia estar sanitizada
        await em.flush()
        res.status(200).json({message: 'Block updeted sucesfully', data: blockToUpdate})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id
        const blockToRemove = em.getReference(Block, id)
        await em.removeAndFlush(blockToRemove) //deberia estar sanitizada
        res.status(200).json({message: 'Block removed sucesfully', data: blockToRemove})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}




export {sanitizeBlockInput,  findAll, findOne, add, update, remove}