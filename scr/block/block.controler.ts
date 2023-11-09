
import { Request, Response, NextFunction } from 'express'
import { Block } from './block.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em
em.getRepository(Block)


function sanitizeBlockInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeInput = {
    numBlock: req.body.numBlock,
    startTime: req.body.startTime
  }
  //more checks here
  Object.keys(req.body.sanitizeInput).forEach((key) => {
    if (req.body.sanitizeInput[key] === undefined) {
      delete req.body.sanitizeInput[key]
    }
  })
  next()
}



//FUNCIONES PARA CREAR AUTOMATICAMENTE TODOS LOS BLOQUES

function formatoHora(hora: Date): string {
  const horas = hora.getHours().toString().padStart(2, '0');
  const minutos = hora.getMinutes().toString().padStart(2, '0');
  const segundos = hora.getSeconds().toString().padStart(2, '0');
  return `${horas}:${minutos}:${segundos}`;
}

async  function addAll(req: Request, res: Response) {
     try {
        let hora = new Date('2023-01-01T00:00:00')
        let blocks: Block[] = [];
        for(let x=0; x<=48 ;x=x+1){
          req.body.numBlock = x.toString();
          req.body.startTime = formatoHora(hora)
          hora = new Date(hora.getTime() + 30 * 60 * 1000)
          let block = em.create(Block, req.body)
          blocks.push(block)
    } 
    await em.flush()
    res.status(200).json({message: 'All blocks created sucesfulli', data: blocks})
  } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

//FIN DE FUNCIONES PARA CREAR TODOS LOS BLOQUES


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



async function add(req: Request, res:Response) {
  try {
    const block = em.create(Block, req.body.sanitizeInput)
     await em.flush() //seria como el save. Persiste. 
     res.status(200).json({message: 'Block created sucesfully', data: block})
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


//BORRAR TODOS LOS BLOQUES. 
async function removeAll(req: Request, res: Response) {
  try {
    const blocks = await em.find(Block,{})
    await em.removeAndFlush(blocks)
    res.status(200).json({message: 'All blocks removed'})
  }catch (error: any) {
        res.status(500).json({message: error.message})
    }
  
}


export {sanitizeBlockInput,  findAll, findOne, add, update, remove, removeAll, addAll}