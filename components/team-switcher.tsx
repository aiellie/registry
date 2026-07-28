"use client"

import * as React from "react"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { PlusSignIcon, ChevronDown } from "@hugeicons/core-free-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface Team {
  name: string
  logo: IconSvgElement
  plan: string
}

export function TeamSwitcher({
  teams,
  activeTeam: activeTeamProp,
  onTeamChange,
}: {
  teams: Team[]
  /** Team name. Leave undefined to let the switcher own its selection. */
  activeTeam?: string
  onTeamChange?: (team: string) => void
}) {
  const [uncontrolledTeam, setUncontrolledTeam] = React.useState(teams[0]?.name)
  const activeName = activeTeamProp ?? uncontrolledTeam
  const activeTeam = teams.find((team) => team.name === activeName) ?? teams[0]

  const selectTeam = React.useCallback(
    (team: Team) => {
      setUncontrolledTeam(team.name)
      onTeamChange?.(team.name)
    },
    [onTeamChange]
  )

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!event.metaKey && !event.ctrlKey) return
      const index = Number(event.key) - 1
      const team = teams[index]
      if (!Number.isInteger(index) || !team) return
      event.preventDefault()
      selectTeam(team)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [teams, selectTeam])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton className="w-full px-1.5 group-data-[collapsible=icon]:p-1!" />}
          >
            <div className="flex aspect-square size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <HugeiconsIcon icon={activeTeam.logo} className="size-3" />
            </div>
            <span className="truncate text-sm">{activeTeam.name}</span>
            <HugeiconsIcon icon={ChevronDown} className="opacity-50 ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => selectTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <HugeiconsIcon
                      icon={team.logo}
                      className="size-3.5 shrink-0"
                    />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
