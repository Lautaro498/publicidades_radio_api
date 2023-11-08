import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Shop } from "./shop.entity.js";


const em = orm.em //entityManager
em.getRepository(Shop)


function sanitizeShopInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        //regDate: req.body.regDate, //duda, no deberia entrar?
        fantasyName: req.body.fantasyName,
        address: req.body.address,
        billingType: req.body.billingType,
        mail: req.body.mail,
        usualPaymentForm: req.body.usualPaymentForm,
        type: req.body.type,
        //numShop: req.body.numShop,
        contact: req.body.contact,
        owner: req.body.owner
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
        const shops = await em.find(Shop, {}, {populate:['contact', 'owner']}) //no pongo contrataciones porque no esta desarrollada
        res.status(200).json({message: 'Find all Shops', data: shops})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    
}

async function findOne(req: Request, res: Response) {
     try {
        const id = req.params.id
        const shop = await em.findOneOrFail(Shop, {id}, {populate: ['contact', 'owner']})
        res.status(200).json({message: 'Shop founded', data: shop})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    
}


async  function add(req: Request, res: Response) {
     try {
        const shop = em.create(Shop, req.body.sanitizeInput) //tengo un problema con el sanitazed input
        await em.flush() //seria como el save. Persiste. 
        res.status(200).json({message: 'Shop created sucesfully', data: shop})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
    try {
        const id = req.params.id
        const shopToUpdate = await em.findOneOrFail(Shop, {id})
        em.assign(shopToUpdate, req.body.sanitizeInput) //deberia estar sanitizada
        await em.flush()
        res.status(200).json({message: 'Shop updeted sucesfully', data: shopToUpdate})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id
        const shopToRemove = em.getReference(Shop, id)
        await em.removeAndFlush(shopToRemove) //deberia estar sanitizada
        
        res.status(200).json({message: 'Shop removed sucesfully', data: shopToRemove})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

export {sanitizeShopInput, findAll, findOne, add, update, remove}