"use client"

import * as React from "react"

import { Example, ExampleWrapper } from "@/components/example"
import {
  ModelSelector,
  ModelSelectorCluster,
  ModelSelectorClusters,
  ModelSelectorCombobox,
  ModelSelectorComboboxCollection,
  ModelSelectorComboboxContent,
  ModelSelectorComboboxEmpty,
  ModelSelectorComboboxGroup,
  ModelSelectorComboboxInput,
  ModelSelectorComboboxItem,
  ModelSelectorComboboxLabel,
  ModelSelectorComboboxList,
  ModelSelectorComboboxTrigger,
  ModelSelectorComboboxValue,
  ModelSelectorContent,
  ModelSelectorDialog,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorShortcut,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector"
import { Kbd } from "@/components/ui/kbd"
import { type Model, models } from "@/lib/models"

/* -------------------------------------------------------------------------- */
/*                        Model → capability clusters                          */
/* -------------------------------------------------------------------------- */

const MODALITIES = ["text", "image", "audio", "video"] as const

/** Modalities the model accepts, plus file input when supported. */
function inputsOf(model: Model) {
  const modalities = model.modalities ?? {}
  const inputs: string[] = MODALITIES.filter(
    (modality) =>
      modalities[modality] === "input" || modalities[modality] === "both"
  )

  if (model.features?.includes("file-input")) {
    inputs.push("file")
  }

  return inputs
}

/** Modalities the model emits. */
function outputsOf(model: Model) {
  const modalities = model.modalities ?? {}

  return MODALITIES.filter(
    (modality) =>
      modalities[modality] === "output" || modalities[modality] === "both"
  ) as string[]
}

/** Feature and tool support, minus anything already shown as an input. */
function featuresOf(model: Model) {
  return [
    ...(model.features ?? []).filter(
      (feature) => feature !== "file-input" && feature !== "vision"
    ),
    ...(model.tools ?? []),
  ]
}

const CHEFS = [...new Set(models.map((model) => model.chef))]

function modelsByChef(chef: string) {
  return models.filter((model) => model.chef === chef)
}

function findModel(id: string) {
  return models.find((model) => model.id === id)
}

type ModelGroup = { value: string; items: Model[] }

/** Combobox filters through `items`, so groups are data rather than markup. */
const MODEL_GROUPS: ModelGroup[] = CHEFS.map((chef) => ({
  value: chef,
  items: modelsByChef(chef),
}))

/* -------------------------------------------------------------------------- */
/*                                  Rows                                       */
/* -------------------------------------------------------------------------- */

/** Shared row body: logo, name, then the input / output / features clusters. */
function ModelRow({
  model,
  showLabels = false,
  colored = false,
}: {
  model: Model
  showLabels?: boolean
  colored?: boolean
}) {
  return (
    <>
      <ModelSelectorLogo
        provider={model.chefSlug}
        variant={colored ? "color" : "mono"}
      />
      <ModelSelectorName>{model.name}</ModelSelectorName>
      <ModelSelectorClusters
        features={featuresOf(model)}
        showLabels={showLabels}
      />
    </>
  )
}

/** Shared popup body for both combobox triggers. */
function ComboboxModelList({ colored = false }: { colored?: boolean }) {
  return (
    <ModelSelectorComboboxContent align="start">
      <ModelSelectorComboboxInput placeholder="Search models..." />
      <ModelSelectorComboboxEmpty>No models found.</ModelSelectorComboboxEmpty>
      <ModelSelectorComboboxList>
        {(group: ModelGroup) => (
          <ModelSelectorComboboxGroup items={group.items} key={group.value}>
            <ModelSelectorComboboxLabel>
              {group.value}
            </ModelSelectorComboboxLabel>
            <ModelSelectorComboboxCollection>
              {(model: Model) => (
                <ModelSelectorComboboxItem key={model.id} value={model}>
                  <ModelRow colored={colored} model={model} />
                </ModelSelectorComboboxItem>
              )}
            </ModelSelectorComboboxCollection>
          </ModelSelectorComboboxGroup>
        )}
      </ModelSelectorComboboxList>
    </ModelSelectorComboboxContent>
  )
}

const CommandRow = React.memo(function CommandRow({
  model,
  selected,
  onSelect,
  showLabels,
}: {
  model: Model
  selected: string
  onSelect: (id: string) => void
  showLabels?: boolean
}) {
  return (
    <ModelSelectorItem
      data-checked={selected === model.id}
      keywords={[model.name, model.chef]}
      onSelect={onSelect}
      value={model.id}
    >
      <ModelRow model={model} showLabels={showLabels} />
    </ModelSelectorItem>
  )
})

/* -------------------------------------------------------------------------- */
/*                                  Examples                                   */
/* -------------------------------------------------------------------------- */

export default function ModelSelectorExample() {
  return (
    <ExampleWrapper>
      <CommandDefaultTrigger />
      <CommandIconTrigger />
      <ComboboxDefaultTrigger />
      <ComboboxIconTrigger />
      <ClusterLabels />
      <CommandPalette />
    </ExampleWrapper>
  )
}

function CommandDefaultTrigger({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState("claude-opus-4.8")
  const model = findModel(selected)

  const handleSelect = React.useCallback((id: string) => {
    setSelected(id)
    setOpen(false)
  }, [])

  return (
    <Example title="Command — default trigger" containerClassName={className}>
      <ModelSelector onOpenChange={setOpen} open={open}>
        <ModelSelectorTrigger>
          {model && <ModelSelectorLogo provider={model.chefSlug} />}
          <ModelSelectorName>{model?.name}</ModelSelectorName>
        </ModelSelectorTrigger>
        <ModelSelectorContent className="sm:max-w-lg">
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            {CHEFS.map((chef) => (
              <ModelSelectorGroup heading={chef} key={chef}>
                {modelsByChef(chef).map((item) => (
                  <CommandRow
                    key={item.id}
                    model={item}
                    onSelect={handleSelect}
                    selected={selected}
                  />
                ))}
              </ModelSelectorGroup>
            ))}
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    </Example>
  )
}

function CommandIconTrigger({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState("gpt-5.6-sol")
  const model = findModel(selected)

  const handleSelect = React.useCallback((id: string) => {
    setSelected(id)
    setOpen(false)
  }, [])

  return (
    <Example title="Command — icon trigger" containerClassName={className}>
      <ModelSelector onOpenChange={setOpen} open={open}>
        <ModelSelectorTrigger tooltip={model?.name} variant="icon">
          {model && (
            <ModelSelectorLogo className="size-4" provider={model.chefSlug} />
          )}
        </ModelSelectorTrigger>
        <ModelSelectorContent className="sm:max-w-lg">
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            {CHEFS.map((chef) => (
              <ModelSelectorGroup heading={chef} key={chef}>
                {modelsByChef(chef).map((item) => (
                  <CommandRow
                    key={item.id}
                    model={item}
                    onSelect={handleSelect}
                    selected={selected}
                  />
                ))}
              </ModelSelectorGroup>
            ))}
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    </Example>
  )
}

function ComboboxDefaultTrigger({ className }: { className?: string }) {
  const [selected, setSelected] = React.useState<Model | null>(
    findModel("gemini-3.1-pro-preview") ?? models[0]
  )

  return (
    <Example title="Combobox — default trigger (color)" containerClassName={className}>
      <ModelSelectorCombobox
        items={MODEL_GROUPS}
        itemToStringValue={(model: Model) => `${model.name} ${model.chef}`}
        onValueChange={setSelected}
        value={selected}
      >
        <ModelSelectorComboboxTrigger>
          <ModelSelectorComboboxValue>
            {(model: Model | null) =>
              model ? (
                <>
                  <ModelSelectorLogo provider={model.chefSlug} variant="color" />
                  <ModelSelectorName>{model.name}</ModelSelectorName>
                </>
              ) : (
                <ModelSelectorName className="text-muted-foreground">
                  Select a model
                </ModelSelectorName>
              )
            }
          </ModelSelectorComboboxValue>
        </ModelSelectorComboboxTrigger>
        <ComboboxModelList colored />
      </ModelSelectorCombobox>
    </Example>
  )
}

function ComboboxIconTrigger({ className }: { className?: string }) {
  const [selected, setSelected] = React.useState<Model | null>(
    findModel("claude-opus-4.8") ?? models[0]
  )

  return (
    <Example title="Combobox — icon trigger (color)" containerClassName={className}>
      <ModelSelectorCombobox
        items={MODEL_GROUPS}
        itemToStringValue={(model: Model) => `${model.name} ${model.chef}`}
        onValueChange={setSelected}
        value={selected}
      >
        <ModelSelectorComboboxTrigger
          tooltip={selected?.name ?? "Select a model"}
          variant="icon"
        >
          {selected && (
            <ModelSelectorLogo
              className="size-4"
              provider={selected.chefSlug}
              variant="color"
            />
          )}
        </ModelSelectorComboboxTrigger>
        <ComboboxModelList colored />
      </ModelSelectorCombobox>
    </Example>
  )
}

function ClusterLabels({ className }: { className?: string }) {
  const model = findModel("claude-opus-4.8") ?? models[0]

  return (
    <Example
      className="justify-center gap-4"
      title="Clusters — input, output, features"
      containerClassName={className}
    >
      <div className="flex w-full flex-col gap-3">
        <ModelSelectorCluster
          capabilities={inputsOf(model)}
          className="w-fit"
          label="Input"
        />
        <ModelSelectorCluster
          capabilities={outputsOf(model)}
          className="w-fit"
          label="Output"
        />
        <ModelSelectorCluster
          capabilities={featuresOf(model)}
          className="w-fit"
          label="Features"
        />
      </div>
    </Example>
  )
}

function CommandPalette({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState("claude-fable-5")

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "m" &&
        event.shiftKey &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSelect = React.useCallback((id: string) => {
    setSelected(id)
    setOpen(false)
  }, [])

  return (
    <Example title="Command palette — ⌘⇧M, no trigger" containerClassName={className}>
      <p className="text-sm text-muted-foreground">
        Press <Kbd>⌘</Kbd> <Kbd>⇧</Kbd> <Kbd>M</Kbd> to pick a model.{" "}
        <span className="text-foreground">{findModel(selected)?.name}</span> is
        selected.
      </p>
      <ModelSelectorDialog
        className="sm:max-w-lg"
        onOpenChange={setOpen}
        open={open}
      >
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          {CHEFS.map((chef) => (
            <ModelSelectorGroup heading={chef} key={chef}>
              {modelsByChef(chef).map((item) => (
                <ModelSelectorItem
                  data-checked={selected === item.id}
                  key={item.id}
                  keywords={[item.name, item.chef]}
                  onSelect={handleSelect}
                  value={item.id}
                >
                  <ModelSelectorLogo provider={item.chefSlug} />
                  <ModelSelectorName>{item.name}</ModelSelectorName>
                  <ModelSelectorShortcut>
                    {item.contextWindow
                      ? `${Math.round(item.contextWindow / 1000)}k`
                      : null}
                  </ModelSelectorShortcut>
                </ModelSelectorItem>
              ))}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
      </ModelSelectorDialog>
    </Example>
  )
}
