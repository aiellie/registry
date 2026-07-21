import {
  Example,
  ExampleWrapper,
} from "@/components/example"
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
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { glassImage } from "@/lib/glass"
import { gradientImage } from "@/lib/gradient"

export default function AvatarExample() {
  return (
    <ExampleWrapper>
      <AvatarSizes />
      <AvatarDropdown />
      <AvatarWithBadge />
      <AvatarWithBadgeIcon />
      <AvatarGroupExample />
      <AvatarGroupWithCount />
      <AvatarGroupWithIconCount />
      <AvatarGlass />
      <AvatarGradient />
      <AvatarInEmpty />
    </ExampleWrapper>
  )
}

function AvatarSizes() {
  return (
    <Example title="Sizes">
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

function AvatarDropdown() {
  return (
    <Example title="Dropdown">
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

function AvatarWithBadge() {
  return (
    <Example title="Badge">
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar>
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
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

function AvatarWithBadgeIcon() {
  return (
    <Example title="Badge with Icon">
      <div className="flex flex-wrap items-center gap-2">
        <Avatar size="sm">
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
          <AvatarFallback>AE</AvatarFallback>
          <AvatarBadge>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </AvatarBadge>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
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

function AvatarGroupExample() {
  return (
    <Example title="Group">
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <AvatarGroup>
        <Avatar size="lg">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </Example>
  )
}

function AvatarGroupWithCount() {
  return (
    <Example title="Group with Count">
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
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
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
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
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </Example>
  )
}

function AvatarGroupWithIconCount() {
  return (
    <Example title="Group with Icon Count">
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarImage src="/avatars/aiellie.png" alt="Aiellie avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
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
          <AvatarImage
            src="/avatars/ellie.png"
            alt="Ellie"
          />
          <AvatarFallback>EL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="/favicon.svg"
            alt="Aiellie favicon"
          />
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
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
        </AvatarGroupCount>
      </AvatarGroup>
    </Example>
  )
}

function AvatarGlass() {
  const seeds = ["brand", "aurora", "nebula"] as const

  return (
    <Example title="Glass">
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

function AvatarGradient() {
  const seeds = ["aiellie", "aurora", "cosmos"] as const

  return (
    <Example title="Gradient">
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

function AvatarInEmpty() {
  return (
    <Example title="In Empty">
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
