import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Contract } from "./contract.entity.js";
import { Shop } from "../shop/shop.entity.js";
import { isValid } from 'date-fns';

const em = orm.em //entityManager
em.getRepository(Contract)



function sanitizeContractInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        regDate : req.body.regDate,
        dateFrom : req.body.dateFrom,
        dateTo : req.body.dateTo,
        observations : req.body.observations,
        shop: req.body.shop
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
        const contracts = await em.find(Contract, {}, {populate:['shop', 'orders']}) 
        res.status(200).json({message: 'Find all Contracts', data: contracts})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    
}

async function findOne(req: Request, res: Response) {
     try {
        const id = req.params.id
        const contract = await em.findOneOrFail(Contract, {id}, {populate: ['shop']})
        res.status(200).json({message: 'Contract founded', data: contract})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    
}


async  function add(req: Request, res: Response) {  
     try {
        //BUSCA EL COMERCIO ENVIADO
        const shop = await em.findOne(Shop, req.body.sanitizeInput.shop)
        console.log(shop)
        // CREA EL CONTRATO SI EXISTE EL COMERCIO
        if (shop !== null) {
            //VALIDA QUE LAS FECHAS SEAN CORRECTAS EN FORMATO Y LA INICIAL MENOR QUE LA FINAL
            if (validateDates(req)) {
                const contract = em.create(Contract, req.body.sanitizeInput) 
                await em.flush()
                res.status(200).json({message: 'Contract created sucesfully', data: contract}) }
            else {res.status(500).json({message: 'Dates are invalid.'})}
        }
        else { 
            res.status(500).json({message: 'Shop does not exists'})}
        
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
    try {
        const id = req.params.id
        const contractToUpdate = await em.findOneOrFail(Contract, {id})
        //VALIDA LAS FECHAS
        if (validateDates(req)) {
            em.assign(contractToUpdate, req.body.sanitizeInput) //deberia estar sanitizada
            await em.flush()
            res.status(200).json({message: 'Contract updeted sucesfully', data: contractToUpdate}) }
        else {res.status(500).json({message: 'Dates are invalid'})}
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}


async function remove(req: Request, res: Response) {
    try {
        const id = req.params.id
        const contractToRemove = em.getReference(Contract, id)
        await em.removeAndFlush(contractToRemove) //deberia estar sanitizada
        
        res.status(200).json({message: 'Contract removed sucesfully', data: contractToRemove})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
}

async function getByShop(req: Request, res: Response) {
    try {
        const idShop = req.params.idShop
        const contracts = await em.find(Contract, {shop: idShop}, {populate: ['shop']} ) //¿popular con contacto y titular?
        res.status(200).json({message: 'Contract founded sucesfully', data: contracts})
    } catch (error : any) {
        res.status(500).json({message: error.message})
    }
}

//CONVIERTE EL STRING EN UNA FECHA. EL FORMATO ESPERADO ES "30/1/2024, 18:05:17"
function stringToDate(fechaString: string): Date | null {
  const [fechaParte, horaParte] = fechaString.split(', ');
  // Analiza la parte de la fecha
  const [dia, mes, año] = fechaParte.split('/').map(Number);
  // Analiza la parte de la hora
  const [hora, minutos, segundos] = horaParte.split(':').map(Number);
  // Intenta crear un objeto Date
  if ((dia<=31 && dia>=1)&&(mes>= 1 && mes<=12)&&(año>=2000)) {
  const fecha = new Date(año, mes - 1, dia, hora, minutos, segundos); 

  // Verifica si la fecha es válida utilizando date-fns
  if (isValid(fecha)) {
    return fecha;
  } else {
    return null;
  } 
}
else {return null}
}

//VALIDA QUE FECHA INICIAL SEA MENOR QUE FINAL Y A SU VEZ QUE EL FORMATO RECIBIDO SEA CORRECTO.
function validateDates (req: Request) {
    const dateTo = stringToDate(req.body.sanitizeInput.dateTo)
    const dateFrom = stringToDate(req.body.sanitizeInput.dateFrom)
    if (dateTo && dateFrom && (dateFrom < dateTo)) {
        req.body.sanitizeInput.dateTo = dateTo
        req.body.sanitizeInput.dateFrom = dateFrom
        return true

    } else {
        return false
    }
}

export {sanitizeContractInput, getByShop, findAll, findOne, add, update, remove}