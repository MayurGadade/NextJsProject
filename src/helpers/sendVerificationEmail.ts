import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/varificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode:string, ): Promise<ApiResponse> {
    console.log("this is comiong form sendVerificationEmail",email, username, verifyCode);
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Mystry message | Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {
            success: true,
            message: "Email sent successfully",
        }
    }

        catch(emailError){
            console.log("error sending email",emailError);
            return {
                success: false,
                message: "Error sending email",    
            }
        } 
}

