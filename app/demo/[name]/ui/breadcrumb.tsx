import Link from "next/link"

import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Book01Icon,
  DotIcon,
  GithubIcon,
  GridViewIcon,
  Home01Icon,
  PaintBucketIcon,
  Route01Icon,
} from "@hugeicons/core-free-icons"

const breadcrumbItemClassName = "inline-flex flex-row items-center gap-1.5"

export default function BreadcrumbExample() {
  return (
    <ExampleWrapper>
      <BreadcrumbBasic />
      <BreadcrumbWithDropdown />
      <BreadcrumbWithLink />
      <BreadcrumbDropdown />
      <BreadcrumbCustomSeparator />
    </ExampleWrapper>
  )
}

function BreadcrumbBasic() {
  return (
    <Example title="Basic" className="items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={breadcrumbItemClassName}>
              <HugeiconsIcon
                icon={Home01Icon}
                strokeWidth={2}
                data-icon="inline-start"
                className="size-3.5"
              />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={breadcrumbItemClassName}>
              <HugeiconsIcon
                icon={GridViewIcon}
                strokeWidth={2}
                data-icon="inline-start"
                className="size-3.5"
              />
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={breadcrumbItemClassName}>
              <HugeiconsIcon
                icon={Route01Icon}
                strokeWidth={2}
                data-icon="inline-start"
                className="size-3.5"
              />
              Breadcrumb
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}

function BreadcrumbWithDropdown() {
  return (
    <Example title="With Dropdown" className="items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={breadcrumbItemClassName}>
              <HugeiconsIcon
                icon={Home01Icon}
                strokeWidth={2}
                data-icon="inline-start"
                className="size-3.5"
              />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button size="icon-sm" variant="ghost" />}
              >
                <BreadcrumbEllipsis />
                <span className="sr-only">Toggle menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Book01Icon} strokeWidth={2} />
                  Documentation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={PaintBucketIcon} strokeWidth={2} />
                  Themes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
                  GitHub
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={breadcrumbItemClassName}>
              <HugeiconsIcon
                icon={GridViewIcon}
                strokeWidth={2}
                data-icon="inline-start"
                className="size-3.5"
              />
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}

function BreadcrumbDropdown() {
  return (
    <Example title="Dropdown" className="items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="#" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <HugeiconsIcon icon={DotIcon} strokeWidth={2} className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="inline-flex flex-row items-center gap-1" />
                }
              >
                Components
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  data-icon="inline-end"
                  className="size-3.5"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Book01Icon} strokeWidth={2} />
                  Documentation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={PaintBucketIcon} strokeWidth={2} />
                  Themes
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
                  GitHub
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <HugeiconsIcon icon={DotIcon} strokeWidth={2} className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}

function BreadcrumbCustomSeparator() {
  return (
    <Example title="Custom Separator" className="items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="#" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <HugeiconsIcon icon={DotIcon} strokeWidth={2} className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="#" />}>
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <HugeiconsIcon icon={DotIcon} strokeWidth={2} className="size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}

function BreadcrumbWithLink() {
  return (
    <Example title="With Link" className="items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="#" />}
              className={breadcrumbItemClassName}
            >
              <HugeiconsIcon
                icon={Home01Icon}
                strokeWidth={2}
                data-icon="inline-start"
                className="size-3.5"
              />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="#" />}
              className={breadcrumbItemClassName}
            >
              <HugeiconsIcon
                icon={GridViewIcon}
                strokeWidth={2}
                data-icon="inline-start"
                className="size-3.5"
              />
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className={breadcrumbItemClassName}>
              <HugeiconsIcon
                icon={Route01Icon}
                strokeWidth={2}
                data-icon="inline-start"
                className="size-3.5"
              />
              Breadcrumb
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}
