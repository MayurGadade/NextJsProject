/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Input } from "@/components/ui/input";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { set } from "mongoose";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { resolve } from "path";
import React, { use, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { watch, register, setValue } = form;

  const acceptMessage = watch("acceptMessage");

  const fatchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-message`);
      setValue("acceptMessage", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Failed to accept message", axiosError);
      toast.error("Error", {
        description:
          axiosError.response?.data.message || "Failed to accept message",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fatchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refresh Messages", {
            description: "Showing latest message",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log("Failed to accept message", axiosError);
        toast.error("Error", {
          description:
            axiosError.response?.data.message || "Failed to accept message",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );
  useEffect(() => {
    if (!session || !session.user) return;
    fatchMessages();
    fatchAcceptMessage();
  }, [setValue, fatchAcceptMessage, fatchMessages, session]);

  // handal switch message
  const handleSwitchMessage = async () => {
    try {
      const response = await axios.post("/api/accept-message", {
        acceptMessages: !acceptMessage,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("Failed to accept message", axiosError);
      toast.error("Error", {
        description:
          axiosError.response?.data.message || "Failed to accept message",
      });
    }
  };

  // const { username } = session?.user as User;
  const username = "test"; // Replace with actual username from session
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  toast.success("Copy Profile Link", {
    description: "Profile link copied to clipboard",
  });

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <>
      <div>
        <Input />
      </div>
    </>
  );
}

export default Page;
