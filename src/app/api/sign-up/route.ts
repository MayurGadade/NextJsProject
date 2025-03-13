import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
// import { request } from "http";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await dbConnect();

    try{
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(!existingUserByEmail){
            return NextResponse.json({
                success:false,
                message:"Enter Email might be null"
            },{status:400})
        }
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message : "Username already exists"
            },{status:400})
        }else{
            const hasedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password=hasedPassword;
            existingUserByEmail.verifyCode=verifyCode;
            existingUserByEmail.verifyCodeExpire=new Date(Date.now()+3600000)

            await existingUserByEmail.save();
        }

            
        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this email "
                },{status:400})
            }

        }else{
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                    username ,
                    email,
                    password:hasedPassword,
                    verifyCode ,
                    verifyCodeExpire : expiryDate,
                    isVerified : false,
                    isAcceptingMessage : true,
                    messages : []
            })
            await newUser.save();
        }       

        // SEND VERIFICATION EMAIL
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }else{
            return Response.json({
                success:true,
                message:"User registered successfully. Please verify your email"
            },{status:201})
        }

    }catch(error){
        console.log("Error in ragistering user",error);
        return Response.json({
            success: false,
            message:"Error ragistering user"
        },{
            status:500
        }
        
    )
    }
}