import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  MusicNote01Icon,
} from "@hugeicons/core-free-icons"

export const item = {
  name: "item",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <Item variant="outline" className="max-w-md">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={CheckmarkBadge01Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="outline">
              Visit profile
            </Button>
          </ItemActions>
        </Item>
      </div>
    ),
    Link: (
      <div className="flex w-full justify-center p-6">
        <Item variant="outline" className="max-w-md" render={<a href="#" />}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={MusicNote01Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Midnight City Lights</ItemTitle>
            <ItemDescription>Neon Dreams — synthwave, 3:42</ItemDescription>
          </ItemContent>
          <ItemActions>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4 rtl:rotate-180"
            />
          </ItemActions>
        </Item>
      </div>
    ),
    Group: (
      <div className="flex w-full justify-center p-6">
        <ItemGroup className="max-w-md">
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>ES</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Ellie Sophia</ItemTitle>
              <ItemDescription>ellie@example.com</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Invite
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>NM</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Noah Martins</ItemTitle>
              <ItemDescription>noah@example.com</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Invite
              </Button>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>LK</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Lena Kowalski</ItemTitle>
              <ItemDescription>lena@example.com</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Invite
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </div>
    ),
  },
}
