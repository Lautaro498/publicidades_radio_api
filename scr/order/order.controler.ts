import { NextFunction, Request, Response } from "express";;
import { orm } from "../shared/db/orm.js";
import { Order } from "./order.entity.js";
import { Contract } from "../contract/contract.entity.js";

const em = orm.em
em.getRepository(Order)

function sanitizeOrderInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput = {
        numOrder: req.body.numOrder,
        regDate: req.body.regDate,
        totalAds: req.body.totalAds, //mayor que uno
        daysAmount: req.body.daysAmount,   //calculado
        nameStrategy: req.body.nameStrategy,
        totalCost: req.body.totalCost, //calculado
        dailyCost: req.body.dailyCost, //calculado
        obs: req.body.obs,
        showName: req.body.showName,
        month: req.body.month,
        contract: req.body.contract, //validar existencia
        spot: req.body.spot // aceptamos null en un primer momento. Al actualizar validar existencia
        //falta el ingreso de datos de los bloques - 
        //podriamos esperar un array con [nroBloque, fechaEmision] para la no regular.
        //allí validamos que las fechas esten detro del contrato y que un mismo bloque no salga dos veces en la misma fecha.
        //para el caso de las regulares podriamos esperar un [dia, [bloques]] ej: [lunes, [12,13,14,15]; martes, [12,14,15,16]]
        //podria manejarlo el front la conversion de no regular a regular, pero es demasiada logica. 
        //deberiamos cambiar la url a la que envia, una para el manejo de las regulares y otra para las no regulares.
    }
    Object.keys(req.body.sanitizeInput).forEach( (key)=>{ 
            if (req.body.sanitizeInput[key] === undefined) {
            delete req.body.sanitizeInput[key]
        }
    })

    next()
}


async function findAll(req: Request, res: Response) {
      try {
        const orders = await em.find(Order, {}, {populate: ['contract', 'spot']})
        res.status(200).json({message: 'Find all Orders', data: orders})
    } catch (error: any) {
        res.status(500).json({message: error.message})
    }
    }

async function findOne(req: Request, res: Response) {
   try {
    const id = req.params.id
    const order = await em.findOneOrFail(Order, { id })
    res.status(200).json({message: 'Order founded sucsesfully', data: order})
   } catch (error: any) {
     res.status(500).json({message: error.message})
   }
}


async  function add(req: Request, res: Response) {
    try{
        const contract = await em.findOne(Contract, req.body.sanitizeInput.contract)
        if (contract !== null ) {
            const order = em.create(Order, req.body.sanitizeInput)
            await em.flush()
            res.status(201).json({message: 'Order created succesfully', data: order})
        }
        else {
            res.status(500).json({message: 'Contract does not exists.'})
        }
    } catch(error: any) {
        res.status(500).json({message: error.message})
    }
}


async function update(req: Request, res: Response)  {
   try {
    const id = req.params.id
    const order = em.getReference(Order, id)
    em.assign(order, req.body.sanitizeInput)
    await em.flush()
    res.status(200).json({message: 'Order modificated succesfully', data: order})
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}


async function remove(req: Request, res: Response) {
    try {
    const id = req.params.id
    const order = em.getReference(Order, id)
    await em.removeAndFlush(order)
    res.status(200).json({message: 'Order deleted succesfully', data: order})
    //duda: como verifico si realmente lo borra, porque 
    //cuando no lo encuentra me dice que se borro igual, 
    //pero realmente no se encontro el contacto.
   } catch (error: any) {
    res.status(500).json({message: error.message})
   }
}

export {sanitizeOrderInput, findAll, findOne, add, update, remove}