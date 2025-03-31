import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";

export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !user){

        return Response.json({
            success: false,
            message: "Not authorized"
        },
        { status: 401 }
        )
    }

    const userId= user._id;
    const {acceptMessages}= await req.json();

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            {_id: userId},
            {isAcceptingMessages: acceptMessages},
            {new: true},
        );
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "User not found",
                updatedUser
            },
            { status: 404 }
            )
        }else{
        return Response.json({
            success: true,
            message: "Message accepted successfully"
        },
        { status: 200 }
        )
    }
    
    }catch (error) {
        console.log("error accepting message",error);
        return Response.json({
            success: false,
            message: "Error accepting message"
        },
        { status: 500 }
        )
    }
}

export async function GET() {

    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !user){

        return Response.json({
            success: false,
            message: "NOt Unauthorized"
        },
        { status: 401 }
        )
    }

    const userId= user._id;

    try {
        const foundUser = await UserModel.findById({_id:userId});
        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            },
            { status: 404 }
            )
        }else{
            return Response.json({
                success: true,
                isAceptingMessage: foundUser.isAcceptingMessage
            },
            { status: 200 }
            )
        }
    } catch (error) {
        console.log("error finding user",error);
        return Response.json({
            success: false,
            message: "User Not Found"
        },
        { status: 500 }
        )
    }

}