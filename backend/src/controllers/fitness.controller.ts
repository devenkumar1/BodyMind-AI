import { Request,Response } from "express"

export const getMeals = async(req:Request,res:Response)=>{
const {requirement,age,gender,isVegetarian,}=req.body();
if(!requirement || !age ||!gender ||  !isVegetarian){
    return res.status(400).json({message:"all fields are required"})

}

    

}