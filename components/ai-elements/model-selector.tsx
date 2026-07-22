"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
} from "@/components/ui/combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  AiImageIcon,
  ArrowDown01Icon,
  Attachment01Icon,
  AudioWave01Icon,
  CodeIcon,
  ComputerIcon,
  CursorMagicSelection01Icon,
  Database01Icon,
  EyeIcon,
  File01Icon,
  FileSearchIcon,
  FlashIcon,
  FunctionIcon,
  Globe02Icon,
  Image01Icon,
  Layers01Icon,
  PuzzleIcon,
  SourceCodeIcon,
  SparklesIcon,
  TerminalIcon,
  TextFontIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import type { ComponentProps, ReactElement, ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                                   Shared                                    */
/* -------------------------------------------------------------------------- */

/**
 * Triggers come in two shapes:
 * - `default` renders the logo plus the model name.
 * - `icon` renders the logo only, with the model name moved into a tooltip.
 */
export type ModelSelectorTriggerVariant = "default" | "icon";

type TriggerTooltipProps = {
  variant?: ModelSelectorTriggerVariant;
  /** Model name surfaced in a tooltip. Only rendered for `variant="icon"`. */
  tooltip?: ReactNode;
  tooltipSide?: ComponentProps<typeof TooltipContent>["side"];
};

const withTriggerTooltip = (
  trigger: ReactElement,
  { variant, tooltip, tooltipSide = "top" }: TriggerTooltipProps
) => {
  if (variant !== "icon" || !tooltip) {
    return trigger;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={trigger} />
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const triggerClassName = (variant: ModelSelectorTriggerVariant) =>
  variant === "icon" ? undefined : "w-[200px] justify-between font-normal";

/* -------------------------------------------------------------------------- */
/*                            Command / dialog flavor                          */
/* -------------------------------------------------------------------------- */

export type ModelSelectorProps = ComponentProps<typeof Dialog>;

export const ModelSelector = (props: ModelSelectorProps) => (
  <Dialog {...props} />
);

export type ModelSelectorTriggerProps = ComponentProps<typeof DialogTrigger> &
  TriggerTooltipProps;

export const ModelSelectorTrigger = ({
  className,
  children,
  variant = "default",
  tooltip,
  tooltipSide,
  ...props
}: ModelSelectorTriggerProps) =>
  withTriggerTooltip(
    <DialogTrigger
      aria-label={
        variant === "icon" && typeof tooltip === "string" ? tooltip : undefined
      }
      className={cn(triggerClassName(variant), className)}
      data-slot="model-selector-trigger"
      data-variant={variant}
      render={
        <Button size={variant === "icon" ? "icon" : "default"} variant="outline" />
      }
      {...props}
    >
      {children}
    </DialogTrigger>,
    { variant, tooltip, tooltipSide }
  );

export type ModelSelectorContentProps = Omit<
  ComponentProps<typeof DialogContent>,
  "title"
> & {
  title?: ReactNode;
};

export const ModelSelectorContent = ({
  className,
  children,
  title = "Model Selector",
  ...props
}: ModelSelectorContentProps) => (
  <DialogContent
    aria-describedby={undefined}
    className={cn(
      "outline! border-none! p-0 outline-border! outline-solid!",
      className
    )}
    {...props}
  >
    <DialogTitle className="sr-only">{title}</DialogTitle>
    <Command className="**:data-[slot=command-input-wrapper]:h-auto">
      {children}
    </Command>
  </DialogContent>
);

export type ModelSelectorDialogProps = Omit<
  ComponentProps<typeof Dialog>,
  "title"
> & {
  title?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Trigger-less command palette: drive it with `open`/`onOpenChange`. */
export const ModelSelectorDialog = ({
  children,
  className,
  title,
  ...props
}: ModelSelectorDialogProps) => (
  <ModelSelector {...props}>
    <ModelSelectorContent className={className} title={title}>
      {children}
    </ModelSelectorContent>
  </ModelSelector>
);

export type ModelSelectorInputProps = ComponentProps<typeof CommandInput>;

export const ModelSelectorInput = ({
  className,
  ...props
}: ModelSelectorInputProps) => (
  <CommandInput className={cn("h-auto py-3.5", className)} {...props} />
);

export type ModelSelectorListProps = ComponentProps<typeof CommandList>;

export const ModelSelectorList = (props: ModelSelectorListProps) => (
  <CommandList {...props} />
);

export type ModelSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export const ModelSelectorEmpty = (props: ModelSelectorEmptyProps) => (
  <CommandEmpty {...props} />
);

export type ModelSelectorGroupProps = ComponentProps<typeof CommandGroup>;

export const ModelSelectorGroup = (props: ModelSelectorGroupProps) => (
  <CommandGroup {...props} />
);

export type ModelSelectorItemProps = ComponentProps<typeof CommandItem>;

export const ModelSelectorItem = (props: ModelSelectorItemProps) => (
  <CommandItem {...props} />
);

export type ModelSelectorShortcutProps = ComponentProps<typeof CommandShortcut>;

export const ModelSelectorShortcut = (props: ModelSelectorShortcutProps) => (
  <CommandShortcut {...props} />
);

export type ModelSelectorSeparatorProps = ComponentProps<
  typeof CommandSeparator
>;

export const ModelSelectorSeparator = (props: ModelSelectorSeparatorProps) => (
  <CommandSeparator {...props} />
);

/* -------------------------------------------------------------------------- */
/*                              Combobox flavor                                */
/* -------------------------------------------------------------------------- */

export const ModelSelectorCombobox = <
  Value,
  Multiple extends boolean | undefined = false,
>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple>
) => <Combobox {...props} />;

export type ModelSelectorComboboxTriggerProps =
  ComboboxPrimitive.Trigger.Props & TriggerTooltipProps;

export const ModelSelectorComboboxTrigger = ({
  className,
  children,
  variant = "default",
  tooltip,
  tooltipSide,
  ...props
}: ModelSelectorComboboxTriggerProps) =>
  withTriggerTooltip(
    <ComboboxPrimitive.Trigger
      aria-label={
        variant === "icon" && typeof tooltip === "string" ? tooltip : undefined
      }
      className={cn(triggerClassName(variant), className)}
      data-slot="model-selector-combobox-trigger"
      data-variant={variant}
      render={
        <Button size={variant === "icon" ? "icon" : "default"} variant="outline" />
      }
      {...props}
    >
      {children}
      {variant === "default" && (
        <HugeiconsIcon
          className="pointer-events-none size-4 text-muted-foreground"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      )}
    </ComboboxPrimitive.Trigger>,
    { variant, tooltip, tooltipSide }
  );

export type ModelSelectorComboboxValueProps = ComponentProps<
  typeof ComboboxValue
>;

export const ModelSelectorComboboxValue = (
  props: ModelSelectorComboboxValueProps
) => <ComboboxValue {...props} />;

export type ModelSelectorComboboxContentProps = ComponentProps<
  typeof ComboboxContent
>;

export const ModelSelectorComboboxContent = ({
  className,
  ...props
}: ModelSelectorComboboxContentProps) => (
  <ComboboxContent
    className={cn(
      // The icon trigger is only 32px wide — don't inherit the anchor width.
      "w-[min(28rem,var(--available-width))] min-w-[min(28rem,var(--available-width))]",
      className
    )}
    data-slot="model-selector-combobox-content"
    {...props}
  />
);

export type ModelSelectorComboboxInputProps = ComponentProps<
  typeof ComboboxInput
>;

export const ModelSelectorComboboxInput = ({
  showTrigger = false,
  ...props
}: ModelSelectorComboboxInputProps) => (
  <ComboboxInput showTrigger={showTrigger} {...props} />
);

export type ModelSelectorComboboxListProps = ComponentProps<
  typeof ComboboxList
>;

export const ModelSelectorComboboxList = (
  props: ModelSelectorComboboxListProps
) => <ComboboxList {...props} />;

export type ModelSelectorComboboxItemProps = ComponentProps<
  typeof ComboboxItem
>;

export const ModelSelectorComboboxItem = (
  props: ModelSelectorComboboxItemProps
) => <ComboboxItem {...props} />;

export type ModelSelectorComboboxGroupProps = ComponentProps<
  typeof ComboboxGroup
>;

export const ModelSelectorComboboxGroup = (
  props: ModelSelectorComboboxGroupProps
) => <ComboboxGroup {...props} />;

export type ModelSelectorComboboxLabelProps = ComponentProps<
  typeof ComboboxLabel
>;

export const ModelSelectorComboboxLabel = (
  props: ModelSelectorComboboxLabelProps
) => <ComboboxLabel {...props} />;

export type ModelSelectorComboboxCollectionProps = ComponentProps<
  typeof ComboboxCollection
>;

export const ModelSelectorComboboxCollection = (
  props: ModelSelectorComboboxCollectionProps
) => <ComboboxCollection {...props} />;

export type ModelSelectorComboboxEmptyProps = ComponentProps<
  typeof ComboboxEmpty
>;

export const ModelSelectorComboboxEmpty = (
  props: ModelSelectorComboboxEmptyProps
) => <ComboboxEmpty {...props} />;

export type ModelSelectorComboboxSeparatorProps = ComponentProps<
  typeof ComboboxSeparator
>;

export const ModelSelectorComboboxSeparator = (
  props: ModelSelectorComboboxSeparatorProps
) => <ComboboxSeparator {...props} />;

/* -------------------------------------------------------------------------- */
/*                                  Branding                                   */
/* -------------------------------------------------------------------------- */

export type ModelSelectorLogoProps = Omit<
  ComponentProps<"img">,
  "src" | "alt"
> & {
  provider:
    | "moonshotai-cn"
    | "lucidquery"
    | "moonshotai"
    | "zai-coding-plan"
    | "alibaba"
    | "xai"
    | "vultr"
    | "nvidia"
    | "upstage"
    | "groq"
    | "github-copilot"
    | "mistral"
    | "vercel"
    | "nebius"
    | "deepseek"
    | "alibaba-cn"
    | "google-vertex-anthropic"
    | "venice"
    | "chutes"
    | "cortecs"
    | "github-models"
    | "togetherai"
    | "azure"
    | "baseten"
    | "huggingface"
    | "opencode"
    | "fastrouter"
    | "google"
    | "google-vertex"
    | "cloudflare-workers-ai"
    | "inception"
    | "wandb"
    | "openai"
    | "zhipuai-coding-plan"
    | "perplexity"
    | "openrouter"
    | "zenmux"
    | "v0"
    | "iflowcn"
    | "synthetic"
    | "deepinfra"
    | "zhipuai"
    | "submodel"
    | "zai"
    | "inference"
    | "requesty"
    | "morph"
    | "lmstudio"
    | "anthropic"
    | "aihubmix"
    | "fireworks-ai"
    | "modelscope"
    | "llama"
    | "scaleway"
    | "amazon-bedrock"
    | "cerebras"
    // oxlint-disable-next-line typescript-eslint(ban-types) -- intentional pattern for autocomplete-friendly string union
    | (string & {});
};

export const ModelSelectorLogo = ({
  provider,
  className,
  ...props
}: ModelSelectorLogoProps) => (
  <img
    {...props}
    alt={`${provider} logo`}
    className={cn("size-3 dark:invert", className)}
    height={12}
    src={`https://models.dev/logos/${provider}.svg`}
    width={12}
  />
);

export type ModelSelectorLogoGroupProps = ComponentProps<"div">;

export const ModelSelectorLogoGroup = ({
  className,
  ...props
}: ModelSelectorLogoGroupProps) => (
  <div
    className={cn(
      "flex shrink-0 items-center -space-x-1 [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 dark:[&>img]:bg-foreground",
      className
    )}
    {...props}
  />
);

export type ModelSelectorNameProps = ComponentProps<"span">;

export const ModelSelectorName = ({
  className,
  ...props
}: ModelSelectorNameProps) => (
  <span className={cn("flex-1 truncate text-start", className)} {...props} />
);

/* -------------------------------------------------------------------------- */
/*                          Capability clusters                                */
/* -------------------------------------------------------------------------- */

type CapabilityMeta = {
  icon: typeof TextFontIcon;
  label: string;
};

/**
 * Icon + label for every capability a model can advertise. Spread and extend
 * this map to describe capabilities your provider exposes.
 */
export const modelSelectorCapabilities: Record<string, CapabilityMeta> = {
  // modalities — used by the input and output clusters
  text: { icon: TextFontIcon, label: "Text" },
  image: { icon: Image01Icon, label: "Image" },
  audio: { icon: AudioWave01Icon, label: "Audio" },
  video: { icon: Video01Icon, label: "Video" },
  file: { icon: File01Icon, label: "File" },
  // features & tools — used by the features cluster
  streaming: { icon: FlashIcon, label: "Streaming" },
  "structured-output": { icon: SourceCodeIcon, label: "Structured output" },
  "json-mode": { icon: CodeIcon, label: "JSON mode" },
  "prompt-caching": { icon: Database01Icon, label: "Prompt caching" },
  "predicted-outputs": { icon: SparklesIcon, label: "Predicted outputs" },
  "reasoning-tokens": { icon: AiBrain01Icon, label: "Reasoning" },
  "extended-thinking": { icon: AiBrain01Icon, label: "Extended thinking" },
  "adaptive-thinking": { icon: AiBrain01Icon, label: "Adaptive thinking" },
  vision: { icon: EyeIcon, label: "Vision" },
  "file-input": { icon: Attachment01Icon, label: "File input" },
  "fine-tuning": { icon: CursorMagicSelection01Icon, label: "Fine-tuning" },
  batch: { icon: Layers01Icon, label: "Batch" },
  "function-calling": { icon: FunctionIcon, label: "Function calling" },
  "web-search": { icon: Globe02Icon, label: "Web search" },
  "code-interpreter": { icon: TerminalIcon, label: "Code interpreter" },
  "file-search": { icon: FileSearchIcon, label: "File search" },
  "computer-use": { icon: ComputerIcon, label: "Computer use" },
  "image-generation": { icon: AiImageIcon, label: "Image generation" },
  mcp: { icon: PuzzleIcon, label: "MCP" },
};

export type ModelSelectorCapabilityProps = Omit<
  ComponentProps<"span">,
  "children"
> & {
  capability: keyof typeof modelSelectorCapabilities | (string & {});
  label?: string;
  tooltipSide?: ComponentProps<typeof TooltipContent>["side"];
};

/** One "avatar" in the stack: a round capability chip with a tooltip. */
export const ModelSelectorCapability = ({
  capability,
  label,
  className,
  tooltipSide = "top",
  ...props
}: ModelSelectorCapabilityProps) => {
  const meta = modelSelectorCapabilities[capability];
  const text = label ?? meta?.label ?? capability;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            aria-label={text}
            className={cn(
              // size-5 chip around a size-3 glyph leaves 4px of padding a side,
              // so the -4px stack overlap never bites into the icon itself.
              "relative flex size-5 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border transition-all duration-200 ease-out hover:z-10 hover:scale-110 hover:text-foreground hover:ring-foreground/30 dark:bg-input/60",
              className
            )}
            data-capability={capability}
            data-slot="model-selector-capability"
            {...props}
          >
            <HugeiconsIcon
              className="size-3"
              icon={meta?.icon ?? SparklesIcon}
              strokeWidth={2}
            />
          </span>
        }
      />
      <TooltipContent side={tooltipSide}>{text}</TooltipContent>
    </Tooltip>
  );
};

export type ModelSelectorClusterProps = ComponentProps<"div"> & {
  /** Cluster heading, e.g. `Input`, `Output`, `Features`. */
  label?: ReactNode;
  /** Capability keys rendered as icons. */
  capabilities?: string[];
  /** Hide the cluster entirely when it has nothing to show. */
  hideEmpty?: boolean;
};

/**
 * One cluster — `Input`, `Output` or `Features` — drawn as an avatar group:
 * the chips overlap at rest and fan apart when the stack is hovered.
 */
export const ModelSelectorCluster = ({
  label,
  capabilities,
  hideEmpty = true,
  className,
  children,
  ...props
}: ModelSelectorClusterProps) => {
  if (hideEmpty && !capabilities?.length && !children) {
    return null;
  }

  return (
    <TooltipProvider delay={150}>
      <div
        className={cn("flex shrink-0 items-center gap-1.5", className)}
        data-slot="model-selector-cluster"
        {...props}
      >
        {label ? (
          <span
            className="text-[10px] font-medium tracking-wide text-muted-foreground/70 uppercase"
            data-slot="model-selector-cluster-label"
          >
            {label}
          </span>
        ) : null}
        <div
          className="flex items-center -space-x-1 transition-all duration-200 ease-out hover:space-x-0.5"
          data-slot="model-selector-cluster-stack"
        >
          {capabilities?.map((capability) => (
            <ModelSelectorCapability capability={capability} key={capability} />
          ))}
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
};

export type ModelSelectorClustersProps = ComponentProps<"div"> & {
  input?: string[];
  output?: string[];
  features?: string[];
  /** Render the `Input`/`Output`/`Features` headings above each icon set. */
  showLabels?: boolean;
};

/**
 * The three capability clusters — input modalities, output modalities and
 * feature/tool support. Pass the arrays, or compose `ModelSelectorCluster`
 * children directly for full control.
 */
export const ModelSelectorClusters = ({
  input,
  output,
  features,
  showLabels = false,
  className,
  children,
  ...props
}: ModelSelectorClustersProps) => (
  <TooltipProvider delay={150}>
    <div
      className={cn("flex shrink-0 items-center gap-2.5", className)}
      data-slot="model-selector-clusters"
      {...props}
    >
      {children ?? (
        <>
          <ModelSelectorCluster
            capabilities={input}
            label={showLabels ? "In" : undefined}
          />
          <ModelSelectorCluster
            capabilities={output}
            label={showLabels ? "Out" : undefined}
          />
          <ModelSelectorCluster
            capabilities={features}
            label={showLabels ? "Feat" : undefined}
          />
        </>
      )}
    </div>
  </TooltipProvider>
);
