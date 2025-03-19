import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import{usernameValidation} from "@/schemas/signUpSchema"

const userNameQuerySchema = z.object({
    username:usernameValidation,
})

export async function GET(request:Request){

    await dbConnect()
    try{

        const {searchParams} = new URL(request.url);
        console.log("this is serach params",searchParams);
        const queryParam = {
            username:searchParams.get('username'),
        }
        const result= userNameQuerySchema.safeParse(queryParam)
        console.log("this is query param",result);
        if(!result.success ){
            return Response.json({
                success:false,
                message:"Invalid username"
            },
            {status:400}
            )
        }
        const {username} = result.data;
        console.log("this is user data",username);
        const existingUser = await UserModel.findOne({username, isVerified:true});

        if(existingUser){
            return Response.json({
                success:false,
                message:"Username already taken"
            },{status:400},)
            }
            else{
                return Response.json({
                    success:true,
                    message:"Username is available"
                },
                {status:200}
                )
            }

    }catch(error){
        console.error("Some error while checking username",error);
        return Response.json({
            success:false,
            message:"Some error while checking username"
        },
        {status:500}
    )
    }
}