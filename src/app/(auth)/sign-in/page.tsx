/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useDebounceValue } from 'usehooks-ts'
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from 'next/router'
import { sign } from 'crypto'
import {signUpSchema} from "@/schemas/signUpSchema"
import { set } from 'mongoose'
import axios,{ AxiosError } from "axios"
import { ApiResponse } from '@/types/ApiResponse'


const Page=()=> {
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingUsername,setIsCheckingUsername]=useState(false)
  const [isSubmitting,setIsSubmitting]=useState(false)

  const debounceUsername=useDebounceValue(username,300)

  const router = useRouter();

  // toast("Scheduled: Catch up",{
  //   description: "Friday, February 10, 2023 at 5:57 PM",
  // })

  //zod Implimentation
  const form =useForm({
    resolver:zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(()=>{
    const checkUsernameUnique=async ()=>{
      if(debounceUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try{
          const response=await axios.get(`/api/check-username-unique?username=${debounceUsername}`)
          console.log("this is username",response);
          setUsernameMessage(response.data.message)
        }catch(error){
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        }finally{
          setIsCheckingUsername(false)
        }
        }
    }
    checkUsernameUnique()
  },[debounceUsername])

  return (
    <div>signIn</div>
  )
}

export default Page