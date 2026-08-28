import { Example, ExampleWrapper } from "@/components/example"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { glassImage } from "@/lib/glass"
import { gradientImage } from "@/lib/gradient"

export default function AvatarExample() {
  return (
    <ExampleWrapper>
      <AvatarSizes />
      <AvatarColors />
      <AvatarDropdown />
      <AvatarWithBadge />
      <AvatarWithBadgeIcon />
      <AvatarGroupExample />
      <AvatarGroupWithCount />
      <AvatarGroupWithIconCount />
      <AvatarAnimated />
      <AvatarGroupAnimated />
      <AvatarGroupHoverCard />
      <AvatarGlass />
      <AvatarGradient />
      <AvatarInEmpty />
    </ExampleWrapper>
  )
}

function AvatarSizes({ className }: { className?: string }) {
  return (
    <Example title="Sizes" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      </div>
    </Example>
  )
}

/* Tailwind needs complete class names in source, so each color spells out its
   full recipe. The avatar border is drawn by the root's `after` pseudo. */
const avatarColors = [
  {
    name: "red",
    root: "after:border-red-200",
    fallback: "bg-red-500/5 text-red-500",
  },
  {
    name: "orange",
    root: "after:border-orange-200",
    fallback: "bg-orange-500/5 text-orange-500",
  },
  {
    name: "amber",
    root: "after:border-amber-200",
    fallback: "bg-amber-500/5 text-amber-500",
  },
  {
    name: "yellow",
    root: "after:border-yellow-200",
    fallback: "bg-yellow-500/5 text-yellow-500",
  },
  {
    name: "lime",
    root: "after:border-lime-200",
    fallback: "bg-lime-500/5 text-lime-500",
  },
  {
    name: "green",
    root: "after:border-green-200",
    fallback: "bg-green-500/5 text-green-500",
  },
  {
    name: "emerald",
    root: "after:border-emerald-200",
    fallback: "bg-emerald-500/5 text-emerald-500",
  },
  {
    name: "teal",
    root: "after:border-teal-200",
    fallback: "bg-teal-500/5 text-teal-500",
  },
  {
    name: "cyan",
    root: "after:border-cyan-200",
    fallback: "bg-cyan-500/5 text-cyan-500",
  },
  {
    name: "sky",
    root: "after:border-sky-200",
    fallback: "bg-sky-500/5 text-sky-500",
  },
  {
    name: "blue",
    root: "after:border-blue-200",
    fallback: "bg-blue-500/5 text-blue-500",
  },
  {
    name: "indigo",
    root: "after:border-indigo-200",
    fallback: "bg-indigo-500/5 text-indigo-500",
  },
  {
    name: "violet",
    root: "after:border-violet-200",
    fallback: "bg-violet-500/5 text-violet-500",
  },
  {
    name: "purple",
    root: "after:border-purple-200",
    fallback: "bg-purple-500/5 text-purple-500",
  },
  {
    name: "fuchsia",
    root: "after:border-fuchsia-200",
    fallback: "bg-fuchsia-500/5 text-fuchsia-500",
  },
  {
    name: "pink",
    root: "after:border-pink-200",
    fallback: "bg-pink-500/5 text-pink-500",
  },
  {
    name: "rose",
    root: "after:border-rose-200",
    fallback: "bg-rose-500/5 text-rose-500",
  },
  {
    name: "slate",
    root: "after:border-slate-200",
    fallback: "bg-slate-500/5 text-slate-500",
  },
  {
    name: "gray",
    root: "after:border-gray-200",
    fallback: "bg-gray-500/5 text-gray-500",
  },
  {
    name: "zinc",
    root: "after:border-zinc-200",
    fallback: "bg-zinc-500/5 text-zinc-500",
  },
  {
    name: "neutral",
    root: "after:border-neutral-200",
    fallback: "bg-neutral-500/5 text-neutral-500",
  },
  {
    name: "stone",
    root: "after:border-stone-200",
    fallback: "bg-stone-500/5 text-stone-500",
  },
  {
    name: "taupe",
    root: "after:border-taupe-200",
    fallback: "bg-taupe-500/5 text-taupe-500",
  },
  {
    name: "mauve",
    root: "after:border-mauve-200",
    fallback: "bg-mauve-500/5 text-mauve-500",
  },
  {
    name: "mist",
    root: "after:border-mist-200",
    fallback: "bg-mist-500/5 text-mist-500",
  },
  {
    name: "olive",
    root: "after:border-olive-200",
    fallback: "bg-olive-500/5 text-olive-500",
  },
]

function AvatarColors({ className }: { className?: string }) {
  return (
    <Example title="Colors" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        {avatarColors.map((color) => (
          <Avatar key={color.name} className={color.root}>
            <AvatarFallback className={color.fallback}>
              {color.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
    </Example>
  )
}

function AvatarDropdown({ className }: { className?: string }) {
  return (
    <Example title="Dropdown" containerClassName={className}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="rounded-full" />
          }
        >
          <Avatar>
            <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}

function AvatarWithBadge({ className }: { className?: string }) {
  return (
    <Example title="Badge" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar>
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar>
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </div>
    </Example>
  )
}

function AvatarWithBadgeIcon({ className }: { className?: string }) {
  return (
    <Example title="Badge with Icon" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
        <Avatar>
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
        <Avatar>
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
      </div>
    </Example>
  )
}

function AvatarGroupExample({ className }: { className?: string }) {
  return (
    <Example title="Group" containerClassName={className}>
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </Example>
  )
}

function AvatarGroupWithCount({ className }: { className?: string }) {
  return (
    <Example title="Group with Count" containerClassName={className}>
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </Example>
  )
}

function AvatarGroupWithIconCount({ className }: { className?: string }) {
  return (
    <Example title="Group with Icon Count" containerClassName={className}>
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/avatars/ellie.png" alt="Ellie" />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/favicon.svg" alt="Aiellie favicon" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </AvatarGroupCount>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage
            src="/avatars/aiellie.png"
            alt="Aiellie avatar"
            className="grayscale"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
            className="grayscale"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
            className="grayscale"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.5} />
        </AvatarGroupCount>
      </AvatarGroup>
    </Example>
  )
}

/* Animated avatars are hover targets already, so each one doubles as a tooltip
   or hover card trigger — the Avatar itself is the trigger element, which keeps
   it a direct child of AvatarGroup so the group's ring and fan-out still apply. */
const teamMembers = [
  {
    initials: "AI",
    name: "Aiellie",
    role: "Design engineer",
    src: "/avatars/aiellie.png",
  },
  {
    initials: "EL",
    name: "Ellie",
    role: "Product designer",
    src: "/avatars/ellie.png",
  },
  {
    initials: "ER",
    name: "Aiellie Bot",
    role: "Automation",
    src: "/favicon.svg",
  },
]

function AvatarAnimated({ className }: { className?: string }) {
  return (
    <Example title="Animated" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-2">
        {(["sm", "default", "lg"] as const).map((size, index) => {
          const member = teamMembers[index]

          return (
            <Tooltip key={member.name}>
              <TooltipTrigger
                render={
                  <Avatar size={size} animated>
                    <AvatarImage src={member.src} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                }
              />
              <TooltipContent>{member.name}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm" animated>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar animated>
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="lg" animated>
          <AvatarFallback>ER</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
      </div>
    </Example>
  )
}

function AvatarGroupAnimated({ className }: { className?: string }) {
  return (
    <Example title="Animated Group" containerClassName={className}>
      {(["sm", "default", "lg"] as const).map((size) => (
        <AvatarGroup key={size} animated>
          {teamMembers.map((member) => (
            <Tooltip key={member.name}>
              <TooltipTrigger
                render={
                  <Avatar size={size}>
                    <AvatarImage src={member.src} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                }
              />
              <TooltipContent>{member.name}</TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger render={<AvatarGroupCount />}>
              {size === "lg" ? (
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.5} />
              ) : (
                "+3"
              )}
            </TooltipTrigger>
            <TooltipContent>
              {size === "lg" ? "Invite members" : "3 more members"}
            </TooltipContent>
          </Tooltip>
        </AvatarGroup>
      ))}
    </Example>
  )
}

function AvatarGroupHoverCard({ className }: { className?: string }) {
  return (
    <Example
      title="Animated Group with Hover Card"
      containerClassName={className}
    >
      <AvatarGroup animated>
        {teamMembers.map((member) => (
          <HoverCard key={member.name}>
            <HoverCardTrigger
              render={
                <Avatar size="lg">
                  <AvatarImage src={member.src} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
              }
            />
            <HoverCardContent className="flex w-56 items-center gap-3">
              <Avatar size="lg">
                <AvatarImage src={member.src} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{member.name}</span>
                <span className="text-xs text-muted-foreground">
                  {member.role}
                </span>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </AvatarGroup>
    </Example>
  )
}

function AvatarGlass({ className }: { className?: string }) {
  const seeds = ["brand", "aurora", "nebula"] as const

  return (
    <Example title="Glass" containerClassName={className}>
      {seeds.map((seed) => (
        <div key={seed} className="flex flex-wrap items-center gap-2">
          <Avatar size="sm">
            <AvatarImage
              src={glassImage(seed, { radius: 50 })}
              alt={`Glass avatar for ${seed}`}
            />
            <AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src={glassImage(seed, { radius: 50 })}
              alt={`Glass avatar for ${seed}`}
            />
            <AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage
              src={glassImage(seed, { radius: 50 })}
              alt={`Glass avatar for ${seed}`}
            />
            <AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </Example>
  )
}

function AvatarGradient({ className }: { className?: string }) {
  const seeds = ["aiellie", "aurora", "cosmos"] as const

  return (
    <Example title="Gradient" containerClassName={className}>
      {seeds.map((seed) => (
        <div key={seed} className="flex flex-wrap items-center gap-2">
          <Avatar size="sm">
            <AvatarImage
              src={gradientImage(seed)}
              alt={`Gradient avatar for ${seed}`}
            />
            <AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src={gradientImage(seed)}
              alt={`Gradient avatar for ${seed}`}
            />
            <AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage
              src={gradientImage(seed)}
              alt={`Gradient avatar for ${seed}`}
            />
            <AvatarFallback>{seed.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </Example>
  )
}

function AvatarInEmpty({ className }: { className?: string }) {
  return (
    <Example title="In Empty" containerClassName={className}>
      <Empty className="w-full flex-none border">
        <EmptyHeader>
          <EmptyMedia>
            <AvatarGroup>
              <Avatar size="lg">
                <AvatarImage
                  src="/avatars/aiellie.png"
                  alt="Aiellie avatar"
                  className="grayscale"
                />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage
                  src="/avatars/ellie.png"
                  alt="Ellie"
                  className="grayscale"
                />
                <AvatarFallback>EL</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage
                  src="/favicon.svg"
                  alt="Aiellie favicon"
                  className="grayscale"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
              </AvatarGroupCount>
            </AvatarGroup>
          </EmptyMedia>
          <EmptyTitle>No Team Members</EmptyTitle>
          <EmptyDescription>
            Invite your team to collaborate on this project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            Invite Members
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  )
}
