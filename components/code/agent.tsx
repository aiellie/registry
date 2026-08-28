"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { asSchema, type Tool } from "ai";
import type { ComponentProps } from "react";
import { memo } from "react";

import { CodeBlock } from "./code-block";

export type AgentProps = ComponentProps<typeof Card>;

export const Agent = memo(({ className, ...props }: AgentProps) => (
  <Card className={cn("not-prose w-full", className)} {...props} />
));

export type AgentAvatarProps = ComponentProps<typeof Avatar>;

export const AgentAvatar = memo(({ className, ...props }: AgentAvatarProps) => (
  <Avatar className={cn("shrink-0", className)} {...props} />
));

export type AgentHeaderProps = ComponentProps<typeof CardHeader> & {
  name: string;
  description?: string;
  model?: string;
};

export const AgentHeader = memo(
  ({
    className,
    name,
    description,
    model,
    children,
    ...props
  }: AgentHeaderProps) => (
    // `flex` wins over CardHeader's grid so the avatar can lead the row while
    // the badge floats to the inline end on its own.
    <CardHeader
      className={cn("flex flex-row items-start gap-3", className)}
      {...props}
    >
      {children}
      <div className="flex min-w-0 flex-col gap-1">
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {model && (
        <CardAction className="ms-auto">
          <Badge className="font-mono text-xs" variant="outline">
            {model}
          </Badge>
        </CardAction>
      )}
    </CardHeader>
  )
);

export type AgentContentProps = ComponentProps<typeof CardContent>;

export const AgentContent = memo(
  ({ className, ...props }: AgentContentProps) => (
    <CardContent className={cn("space-y-4", className)} {...props} />
  )
);

export type AgentInstructionsProps = ComponentProps<typeof Accordion> & {
  children: string;
};

export const AgentInstructions = memo(
  ({ className, children, ...props }: AgentInstructionsProps) => (
    <Accordion className={cn("rounded-xl border", className)} {...props}>
      <AccordionItem className="border-b-0" value="instructions">
        <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
          Instructions
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="rounded-xl bg-muted/50 p-3 text-muted-foreground text-sm">
            <p>{children}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
);

type AgentSectionProps = ComponentProps<typeof Accordion> & {
  label: string;
};

const AgentSection = ({ className, label, ...props }: AgentSectionProps) => (
  <div className={cn("space-y-2", className)}>
    <span className="font-medium text-muted-foreground text-sm">{label}</span>
    <Accordion className="rounded-xl border" {...props} />
  </div>
);

export type AgentToolsProps = ComponentProps<typeof Accordion>;

export const AgentTools = memo((props: AgentToolsProps) => (
  <AgentSection label="Tools" {...props} />
));

export type AgentToolProps = ComponentProps<typeof AccordionItem> & {
  tool: Tool;
};

export const AgentTool = memo(
  ({ className, tool, value, ...props }: AgentToolProps) => {
    // `inputSchema` may be a Zod schema, a `jsonSchema()` wrapper, or any
    // standard schema — `asSchema` normalizes all of them to JSON Schema.
    const schema = asSchema(tool.inputSchema).jsonSchema;

    return (
      <AccordionItem
        className={cn("border-b last:border-b-0", className)}
        value={value}
        {...props}
      >
        <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
          {typeof tool.description === "function"
            ? tool.description({ context: {} })
            : tool.description ?? "No description"}
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="rounded-xl bg-muted/50">
            <CodeBlock code={JSON.stringify(schema, null, 2)} language="json" />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }
);

export type AgentSkillsProps = ComponentProps<typeof Accordion>;

export const AgentSkills = memo((props: AgentSkillsProps) => (
  <AgentSection label="Skills" {...props} />
));

export type AgentSkillProps = ComponentProps<typeof AccordionItem> & {
  name: string;
  description?: string;
};

export const AgentSkill = memo(
  ({
    className,
    name,
    description,
    value,
    children,
    ...props
  }: AgentSkillProps) => (
    <AccordionItem
      className={cn("border-b last:border-b-0", className)}
      value={value}
      {...props}
    >
      <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
        {name}
      </AccordionTrigger>
      <AccordionContent className="px-3 pb-3">
        <div className="rounded-xl bg-muted/50 p-3 text-muted-foreground text-sm">
          {children ?? <p>{description}</p>}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
);

export type AgentSubagentsProps = ComponentProps<typeof CardFooter> & {
  label?: string;
};

export const AgentSubagents = memo(
  ({
    className,
    label = "Subagents",
    children,
    ...props
  }: AgentSubagentsProps) => (
    <CardFooter className={cn("gap-3", className)} {...props}>
      <span className="font-medium text-muted-foreground text-sm">{label}</span>
      <AvatarGroup animated className="ms-auto">
        {children}
      </AvatarGroup>
    </CardFooter>
  )
);

export type AgentSubagentProps = ComponentProps<typeof Avatar> & {
  name: string;
  description?: string;
  model?: string;
  tools?: string[];
};

export const AgentSubagent = memo(
  ({
    className,
    name,
    description,
    model,
    tools,
    children,
    ...props
  }: AgentSubagentProps) => (
    <HoverCard>
      {/* The Avatar *is* the trigger, so it stays a direct child of
          AvatarGroup and keeps the group's ring and fan-out. */}
      <HoverCardTrigger
        render={
          <Avatar className={cn("shrink-0", className)} {...props}>
            {children}
          </Avatar>
        }
      />
      <HoverCardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Avatar className={cn("shrink-0", className)} size="sm" {...props}>
            {children}
          </Avatar>
          <span className="min-w-0 truncate font-medium text-sm">{name}</span>
          {model && (
            <Badge className="ms-auto font-mono text-xs" variant="outline">
              {model}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
        {tools && tools.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tools.map((toolName) => (
              <Badge
                className="bg-background font-mono text-xs"
                key={toolName}
                variant="outline"
              >
                {toolName}
              </Badge>
            ))}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
);

export type AgentOutputProps = ComponentProps<typeof Accordion> & {
  schema: string;
};

export const AgentOutput = memo(
  ({ className, schema, ...props }: AgentOutputProps) => (
    <Accordion className={cn("rounded-xl border", className)} {...props}>
      <AccordionItem className="border-b-0" value="output">
        <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
          Output Schema
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">
          <div className="rounded-xl bg-muted/50">
            <CodeBlock code={schema} language="typescript" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
);

Agent.displayName = "Agent";
AgentAvatar.displayName = "AgentAvatar";
AgentHeader.displayName = "AgentHeader";
AgentContent.displayName = "AgentContent";
AgentInstructions.displayName = "AgentInstructions";
AgentTools.displayName = "AgentTools";
AgentTool.displayName = "AgentTool";
AgentSkills.displayName = "AgentSkills";
AgentSkill.displayName = "AgentSkill";
AgentSubagents.displayName = "AgentSubagents";
AgentSubagent.displayName = "AgentSubagent";
AgentOutput.displayName = "AgentOutput";
