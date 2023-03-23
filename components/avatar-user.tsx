"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import { useDocument } from "@/firebase/firestore/getDocument"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Loader from "./loader"

export function AvatarUser() {
  const { logout } = useGitHubLogout()
  const { user } = useAuthContext()
  const { data, isLoading, isError } = useDocument(
    user.reloadUserInfo.screenName,
    "users"
  )
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="cursor-pointer">
          {isLoading && (
            <AvatarFallback>
              <Loader />
            </AvatarFallback>
          )}
          {data && data.exists && (
            <>
              <AvatarImage
                src={data.data.photoURL}
                alt={data.data.displayName}
              />
              <AvatarFallback>
                {data.data.displayName.split(" ")[1] === undefined
                  ? data.data.displayName.split(" ")[0][0] +
                    data.data.displayName.split(" ")[0][1]
                  : data.data.displayName.split(" ")[0][0] +
                    data.data.displayName.split(" ")[1][0]}
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </SheetTrigger>
      <SheetContent position="right" size="custom_w_200">
        <SheetHeader>
          <SheetTitle>
            Hello {data && data.exists && <span className="font-bold">LN</span>}
          </SheetTitle>
          <SheetDescription>This is your profile.</SheetDescription>
          <div className="py-4"></div>
        </SheetHeader>
        <SheetFooter className="gap-2 md:gap-0">
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Dashboard
          </Link>
          <Button
            className={buttonVariants({ size: "lg", variant: "destructive" })}
            onClick={() => logout()}
          >
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}