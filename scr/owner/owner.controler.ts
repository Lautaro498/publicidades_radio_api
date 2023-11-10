// DUDA: no lo populo con shops, pues deberian no estar creados al momento de pedir estos. 


import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Owner } from "./owner.entity.js";

const em = orm.em
em.getRepository(Owner)

function sanitizeOwnerInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        cuit: req.body.cuit,
        businessName: req.body.businessName,
        fiscalCondition: req.body.fiscalCondition,
    }
    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ //devuelve un arreglo con las keys y para cada uno chequeamos not null
        if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}


async function findAll(req: Request, res: Response) {
      try {
        const owners = await em.find(Owner, {})
        res.status(200).json({message: 'Find all Owners', data: owners})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    }

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const owner = await em.findOneOrFail(Owner, { id })
    res.status(200).json({message: 'Owner founded sucsesfully', data: owner})
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}


async  function add(req: Request, res: Response) {
    try{
        const owner = em.create(Owner, req.body.sanitizeInput)
        await em.flush()
        res.status(201).json({message: 'Owner created succesfully', data: owner})
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
   try {
    const id = req.params.id
    const owner = em.getReference(Owner, id)
    em.assign(owner, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'Owner modificated succesfully', data: owner})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}


async function remove(req: Request, res: Response) {
    try {
    const id = req.params.id
    const owner = em.getReference(Owner, id)
    await em.removeAndFlush(owner)
    res.status(200).json({message: 'Owner deleted succesfully', data: owner})
    //duda: como verifico si realmente lo borra, porque 
    //cuando no lo encuentra me dice que se borro igual, 
    //pero realmente no se encontro el contacto.
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}

export {sanitizeOwnerInput, findAll, findOne, add, update, remove}