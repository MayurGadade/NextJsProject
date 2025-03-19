import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try{
        const {username, code} =await request.json();
        const decodedusername = decodeURIComponent(username);
        const user = await UserModel.findOne({decodedusername});

        if(!user){
            return Response.json({
                success:false,
                message:"Error verifying username"
            },
            {status:400}
            )
        }
        const isCodevalid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodevalid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success:true,
                message:"Acount verified successfully"
            },
            {status:200}
            )
        }else if(!isCodeNotExpired){
            return Response.json({
                success:false,
                message:"Verification code expired, please signup again"
            },
            {status:400}
            )
        }else{
            return Response.json({
                success:false,
                message:"Invalid verification code"
            },
            {status:400}
            )
        }

    }catch(error){
        console.error("Some error while vrifying username",error);
        return Response.json({
            success:false,
            message:"Some error while verifying username"
        },
        {status:500}
    )
    }
}