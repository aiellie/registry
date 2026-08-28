"use client"

import * as React from "react"
import { ArrowUpIcon, PlusIcon } from "lucide-react"

import { gradientImage } from "@/lib/gradient"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
  },
  {
    name: "Aiden Rodriguez",
    email: "aiden.rodriguez@email.com",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
  },
  {
    name: "Ethan Chen",
    email: "ethan.chen@email.com",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
  },
] as const

const gradientAvatar = (seed: string) => gradientImage(seed)

type User = (typeof users)[number]

export function CardsChat() {
  const [open, setOpen] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([])

  const [messages, setMessages] = React.useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
  ])
  const [input, setInput] = React.useState("")
  const inputLength = input.trim().length

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center gap-4">
            <Avatar className="border">
              <AvatarImage
                src={gradientAvatar("sofia.davis@example.com")}
                alt="Sofia Davis"
              />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm leading-none font-medium">Sofia Davis</p>
              <p className="text-xs text-muted-foreground">m@example.com</p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon"
                    variant="secondary"
                    className="ml-auto size-8 rounded-full"
                    onClick={() => setOpen(true)}
                  />
                }
              >
                <PlusIcon />
                <span className="sr-only">New message</span>
              </TooltipTrigger>
              <TooltipContent sideOffset={10}>New message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (inputLength === 0) return
              setMessages([
                ...messages,
                {
                  role: "user",
                  content: input,
                },
              ])
              setInput("")
            }}
            className="relative w-full"
          >
            <InputGroup>
              <InputGroupInput
                id="message"
                placeholder="Type your message..."
                autoComplete="off"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  size="icon-xs"
                  className="rounded-full"
                >
                  <ArrowUpIcon />
                  <span className="sr-only">Send</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        </CardFooter>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="outline-none">
          <DialogHeader className="">
            <DialogTitle>New Group Chat</DialogTitle>
            <DialogDescription>
              Invite a user to this group chat. This will create a new group
              chat.
            </DialogDescription>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border bg-transparent">
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.email}
                    data-checked={selectedUsers.includes(user)}
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(
                          selectedUsers.filter(
                            (selectedUser) => selectedUser !== user
                          )
                        )
                      }

                      return setSelectedUsers(
                        [...users].filter((u) =>
                          [...selectedUsers, user].includes(u)
                        )
                      )
                    }}
                  >
                    <Avatar className="border">
                      <AvatarImage
                        src={gradientAvatar(user.email)}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm leading-none">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar key={user.email} className="inline-block border">
                    <AvatarImage
                      src={gradientAvatar(user.email)}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select users to add to this thread.
              </p>
            )}
            <Button
              disabled={selectedUsers.length < 2}
              onClick={() => {
                setOpen(false)
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
