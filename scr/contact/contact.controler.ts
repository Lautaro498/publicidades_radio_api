import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Contact } from "./contact.entity.js";

const em = orm.em
em.getRepository(Contact)

function sanitizeContactInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        dni: req.body.dni,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone
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
        const contacts = await em.find(Contact, {})
        res.status(200).json({message: 'Find all Contacts', data: contacts})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    }

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const contact = await em.findOneOrFail(Contact, { id })
    res.status(200).json({message: 'Contact founded sucsesfully', data: contact})
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}


async  function add(req: Request, res: Response) {
    try{
        console.log(req.body)
        console.log(req.body.sanitizeInput)
        const contact = em.create(Contact, req.body)
        await em.flush()
        res.status(201).json({message: 'Contact created succesfully', data: contact})
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
   try {
    const id = req.params.id
    const contact = em.getReference(Contact, id)
    em.assign(contact, req.body)
    await em.flush()
    res.status(200).json({message: 'Contact modificated succesfully', data: contact})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}


async function remove(req: Request, res: Response) {
    try {
    const id = req.params.id
    const contact = em.getReference(Contact, id)
    await em.removeAndFlush(contact)
    res.status(200).json({message: 'Contact deleted succesfully'})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}

export {sanitizeContactInput, findAll, findOne, add, update, remove}