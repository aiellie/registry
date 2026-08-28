"use client"

import Image from "next/image"

import { Example, ExampleWrapper } from "@/components/example"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Archive02Icon,
  ArrowDown01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"

const people = [
  {
    username: "shadcn",
    avatar: "https://github.com/shadcn.png",
    email: "shadcn@vercel.com",
  },
  {
    username: "maxleiter",
    avatar: "https://github.com/maxleiter.png",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
]

export default function ItemExample() {
  return (
    <ExampleWrapper>
      <DefaultVariantItems />
      <OutlineVariantItems />
      <MutedVariantItems />
      <DefaultVariantItemsSmall />
      <OutlineVariantItemsSmall />
      <MutedVariantItemsSmall />
      <DefaultVariantItemsExtraSmall />
      <OutlineVariantItemsExtraSmall />
      <MutedVariantItemsExtraSmall />
      <DefaultLinkItems />
      <OutlineLinkItems />
      <MutedLinkItems />
      <DefaultItemGroup />
      <OutlineItemGroup />
      <MutedItemGroup />
      <ItemSeparatorExample />
      <ItemHeaderExamples />
      <ItemFooterExamples />
      <ItemHeaderAndFooterExamples />
      <DefaultVariantItemsWithImage />
      <OutlineVariantItemsWithImage />
      <OutlineVariantItemsWithImageSmall />
      <OutlineVariantItemsWithImageExtraSmall />
      <MutedVariantItemsWithImage />
      <ItemAvatarExample />
      <ItemDropdownExample />
    </ExampleWrapper>
  )
}

function DefaultVariantItems({ className }: { className?: string }) {
  return (
    <Example title="Default" containerClassName={className}>
      <Item>
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItems({ className }: { className?: string }) {
  return (
    <Example title="Outline" containerClassName={className}>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function MutedVariantItems({ className }: { className?: string }) {
  return (
    <Example title="Muted" containerClassName={className}>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function DefaultVariantItemsSmall({ className }: { className?: string }) {
  return (
    <Example title="Small" containerClassName={className}>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsSmall({ className }: { className?: string }) {
  return (
    <Example title="Outline - Small" containerClassName={className}>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function MutedVariantItemsSmall({ className }: { className?: string }) {
  return (
    <Example title="Muted - Small" containerClassName={className}>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function DefaultVariantItemsExtraSmall({ className }: { className?: string }) {
  return (
    <Example title="Extra Small" containerClassName={className}>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsExtraSmall({ className }: { className?: string }) {
  return (
    <Example title="Outline - Extra Small" containerClassName={className}>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function MutedVariantItemsExtraSmall({ className }: { className?: string }) {
  return (
    <Example title="Muted - Extra Small" containerClassName={className}>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" size="xs">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function DefaultLinkItems({ className }: { className?: string }) {
  return (
    <Example title="asChild" containerClassName={className}>
      <ItemGroup>
        <Item render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>Title Only (Link)</ItemTitle>
          </ItemContent>
        </Item>
        <Item render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>Title + Description (Link)</ItemTitle>
            <ItemDescription>
              Clickable item with title and description.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item render={<a href="#" />}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Media + Title (Link)</ItemTitle>
          </ItemContent>
        </Item>
        <Item render={<a href="#" />}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Media + Title + Description (Link)</ItemTitle>
            <ItemDescription>
              Complete link item with media, title, and description.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>With Actions (Link)</ItemTitle>
            <ItemDescription>
              Link item that also has action buttons.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function OutlineLinkItems({ className }: { className?: string }) {
  return (
    <Example title="Outline - asChild" containerClassName={className}>
      <ItemGroup>
        <Item variant="outline" render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>Title Only (Link)</ItemTitle>
          </ItemContent>
        </Item>
        <Item variant="outline" render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>Title + Description (Link)</ItemTitle>
            <ItemDescription>
              Clickable item with title and description.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" render={<a href="#" />}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Media + Title (Link)</ItemTitle>
          </ItemContent>
        </Item>
        <Item variant="outline" render={<a href="#" />}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Media + Title + Description (Link)</ItemTitle>
            <ItemDescription>
              Complete link item with media, title, and description.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>With Actions (Link)</ItemTitle>
            <ItemDescription>
              Link item that also has action buttons.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function MutedLinkItems({ className }: { className?: string }) {
  return (
    <Example title="Muted - asChild" containerClassName={className}>
      <ItemGroup>
        <Item variant="muted" render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>Title Only (Link)</ItemTitle>
          </ItemContent>
        </Item>
        <Item variant="muted" render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>Title + Description (Link)</ItemTitle>
            <ItemDescription>
              Clickable item with title and description.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted" render={<a href="#" />}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Media + Title (Link)</ItemTitle>
          </ItemContent>
        </Item>
        <Item variant="muted" render={<a href="#" />}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Media + Title + Description (Link)</ItemTitle>
            <ItemDescription>
              Complete link item with media, title, and description.
            </ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted" render={<a href="#" />}>
          <ItemContent>
            <ItemTitle>With Actions (Link)</ItemTitle>
            <ItemDescription>
              Link item that also has action buttons.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function DefaultItemGroup({ className }: { className?: string }) {
  return (
    <Example title="ItemGroup" containerClassName={className}>
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemTitle>Item 1</ItemTitle>
            <ItemDescription>First item in the group.</ItemDescription>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle>Item 2</ItemTitle>
            <ItemDescription>Second item in the group.</ItemDescription>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle>Item 3</ItemTitle>
            <ItemDescription>Third item in the group.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function OutlineItemGroup({ className }: { className?: string }) {
  return (
    <Example title="Outline - ItemGroup" containerClassName={className}>
      <ItemGroup>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Item 1</ItemTitle>
            <ItemDescription>First item with icon.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Item 2</ItemTitle>
            <ItemDescription>Second item with icon.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Item 3</ItemTitle>
            <ItemDescription>Third item with icon.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function MutedItemGroup({ className }: { className?: string }) {
  return (
    <Example title="Muted - ItemGroup" containerClassName={className}>
      <ItemGroup>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Item 1</ItemTitle>
            <ItemDescription>First item in muted group.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </ItemActions>
        </Item>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Item 2</ItemTitle>
            <ItemDescription>Second item in muted group.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </ItemActions>
        </Item>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Item 3</ItemTitle>
            <ItemDescription>Third item in muted group.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function ItemSeparatorExample({ className }: { className?: string }) {
  return (
    <Example title="ItemSeparator" containerClassName={className}>
      <ItemGroup>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Inbox</ItemTitle>
            <ItemDescription>View all incoming messages.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Sent</ItemTitle>
            <ItemDescription>View all sent messages.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Drafts</ItemTitle>
            <ItemDescription>View all draft messages.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Archive</ItemTitle>
            <ItemDescription>View archived messages.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function ItemHeaderExamples({ className }: { className?: string }) {
  return (
    <Example title="ItemHeader" containerClassName={className}>
      <Item>
        <ItemHeader>
          <span className="text-sm font-medium">Design System</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Component Library</ItemTitle>
          <ItemDescription>
            A comprehensive collection of reusable UI components for building
            consistent interfaces.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemHeader>
          <span className="text-sm font-medium">Marketing</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Campaign Analytics</ItemTitle>
          <ItemDescription>
            Track performance metrics and engagement rates across all marketing
            channels.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemHeader>
          <span className="text-sm font-medium">Engineering</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>API Documentation</ItemTitle>
          <ItemDescription>
            Complete reference guide for all available endpoints and
            authentication methods.
          </ItemDescription>
        </ItemContent>
      </Item>
    </Example>
  )
}

function ItemFooterExamples({ className }: { className?: string }) {
  return (
    <Example title="ItemFooter" containerClassName={className}>
      <Item>
        <ItemContent>
          <ItemTitle>Quarterly Report Q4 2024</ItemTitle>
          <ItemDescription>
            Financial overview including revenue, expenses, and growth metrics
            for the fourth quarter.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-sm text-muted-foreground">
            Last updated 2 hours ago
          </span>
        </ItemFooter>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>User Research Findings</ItemTitle>
          <ItemDescription>
            Insights from interviews and surveys conducted with 50+ users across
            different demographics.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-sm text-muted-foreground">
            Created by Sarah Chen
          </span>
        </ItemFooter>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Product Roadmap</ItemTitle>
          <ItemDescription>
            Planned features and improvements scheduled for the next three
            months.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-sm text-muted-foreground">12 comments</span>
        </ItemFooter>
      </Item>
    </Example>
  )
}

function ItemHeaderAndFooterExamples({ className }: { className?: string }) {
  return (
    <Example title="ItemHeader + ItemFooter" containerClassName={className}>
      <Item>
        <ItemHeader>
          <span className="text-sm font-medium">Team Project</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Website Redesign</ItemTitle>
          <ItemDescription>
            Complete overhaul of the company website with modern design
            principles and improved user experience.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-sm text-muted-foreground">
            Updated 5 minutes ago
          </span>
        </ItemFooter>
      </Item>
      <Item variant="outline">
        <ItemHeader>
          <span className="text-sm font-medium">Client Work</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Mobile App Development</ItemTitle>
          <ItemDescription>
            Building a cross-platform mobile application for iOS and Android
            with React Native.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-sm text-muted-foreground">
            Status: In Progress
          </span>
        </ItemFooter>
      </Item>
      <Item variant="muted">
        <ItemHeader>
          <span className="text-sm font-medium">Documentation</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>API Integration Guide</ItemTitle>
          <ItemDescription>
            Step-by-step instructions for integrating third-party APIs with
            authentication and error handling.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-sm text-muted-foreground">
            Category: Technical • 3 attachments
          </span>
        </ItemFooter>
      </Item>
    </Example>
  )
}

function DefaultVariantItemsWithImage({ className }: { className?: string }) {
  return (
    <Example title="Default - ItemMedia image" containerClassName={className}>
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsWithImage({ className }: { className?: string }) {
  return (
    <Example title="Outline - ItemMedia image" containerClassName={className}>
      <Item variant="outline">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsWithImageSmall({
  className,
}: {
  className?: string
}) {
  return (
    <Example
      title="Outline - ItemMedia image - Small"
      containerClassName={className}
    >
      <Item variant="outline" size="sm">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsWithImageExtraSmall({
  className,
}: {
  className?: string
}) {
  return (
    <Example
      title="Outline - ItemMedia image - Extra Small"
      containerClassName={className}
    >
      <Item variant="outline" size="xs">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function MutedVariantItemsWithImage({ className }: { className?: string }) {
  return (
    <Example title="Muted - ItemMedia image" containerClassName={className}>
      <Item variant="muted">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function ItemAvatarExample({ className }: { className?: string }) {
  return (
    <Example title="Avatar" containerClassName={className}>
      <Item variant="outline">
        <ItemMedia>
          <Avatar className="size-10">
            <AvatarImage src="https://github.com/evilrabbit.png" />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Evil Rabbit</ItemTitle>
          <ItemDescription>Last seen 5 months ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-full"
            aria-label="Invite"
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            <Avatar className="hidden sm:flex">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="hidden sm:flex">
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>No Team Members</ItemTitle>
          <ItemDescription>
            Invite your team to collaborate on this project.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function ItemDropdownExample({ className }: { className?: string }) {
  return (
    <Example title="Dropdown" containerClassName={className}>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Select <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuGroup>
            {people.map((person) => (
              <DropdownMenuItem key={person.username}>
                <Item size="xs" className="w-full p-2">
                  <ItemMedia>
                    <Avatar className="size-[--spacing(6.5)]">
                      <AvatarImage src={person.avatar} className="grayscale" />
                      <AvatarFallback>
                        {person.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle>{person.username}</ItemTitle>
                    <ItemDescription className="leading-none">
                      {person.email}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Example>
  )
}
