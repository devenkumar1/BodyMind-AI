import { Request, Response } from "express";
import User from "../models/user.model";
import { TrainingSession } from "../models/TrainingSession";

export const getAllTrainers=async(req:Request,res:Response)=>{
    try {
        const trainers= await User.find({ role: 'TRAINER' });
        if(!trainers || trainers.length === 0)  return res.status(400).json({message:"no available trainers",trainers:null});
        res.status(200).json({message:"trainers fetched successfully",trainers});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal server error",error});
    }

}

export const bookTrainer=async (req:Request,res:Response)=>{
    const {trainerId,userId,meetingLink,scheduledTime}=await req.body;
    if(!trainerId||!userId ||!meetingLink||!scheduledTime) return res.status(400).json({message:"trainer id is mandatory"});
    try {
       const newSession= await TrainingSession.create({
        user:userId,
        trainer:trainerId,
        meetingLink:meetingLink,
        scheduledTime:scheduledTime
       })

       if(!newSession) return res.status(300).json({message:"session not created"});
       return res.status(201).json({message:"training session generated succesfully",TrainingSession:newSession});
    } catch (error) {
        console.log("something went wrong in booking session route",error);
        return res.status(500).json({message:"something went wrong in creating session"})
    }

}


export const acceptSessionRequest = async (req:Request,res:Response)=>{
    const {sessionId}=await req.body;
    if(!sessionId) return res.status(400).json({message:"no session link provided"});
    try {
        const currentSession= await TrainingSession.findById(sessionId);
        if(!currentSession) return res.status(400).json({message:"invalid training session id provided"});
        return res.status(200).json({message:"request accept successful"});
    } catch (error) {
    console.log("error occured in accept session route",error);
    return res.status(500).json({message:"something went wrong in accepting session"});        
    }
}

export const rejectSessionRequest = async (req:Request,res:Response)=>{
    const {sessionId}=await req.body;
    if(!sessionId) return res.status(400).json({message:"no session link provided"});
    try {
        const currentSession= await TrainingSession.deleteOne({_id:sessionId});
        return res.status(200).json({message:"request rejected successful"});
    } catch (error) {
    console.log("error occured in reject session route",error);
    return res.status(500).json({message:"something went wrong in rejecting session"});        
    }
}