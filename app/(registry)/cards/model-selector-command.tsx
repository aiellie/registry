"use client"

import * as React from "react"

import {
  ModelSelectorClusters,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Command } from "@/components/ui/command"
import { type Model, models } from "@/lib/models"

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                    Card                                     */
/* -------------------------------------------------------------------------- */

/**
 * The Command flavor of the model selector, rendered inline and always open
 * inside a Card so the full picker is visible without a trigger.
 */
export default function ModelSelectorCommandCard() {
  const [selected, setSelected] = React.useState("claude-opus-4.8")

  const handleSelect = React.useCallback((id: string) => {
    setSelected(id)
  }, [])

  return (
    <Card className="w-full max-w-lg shadow-sm rounded-xl">
      <CardContent>
        <Command className="rounded-xl! ring-1 ring-foreground/10">
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            {CHEFS.map((chef) => (
              <ModelSelectorGroup heading={chef} key={chef}>
                {modelsByChef(chef).map((model) => (
                  <ModelSelectorItem
                    data-checked={selected === model.id}
                    key={model.id}
                    keywords={[model.name, model.chef]}
                    onSelect={handleSelect}
                    value={model.id}
                  >
                    <ModelSelectorLogo provider={model.chefSlug} />
                    <ModelSelectorName>{model.name}</ModelSelectorName>
                    <ModelSelectorClusters features={featuresOf(model)} />
                  </ModelSelectorItem>
                ))}
              </ModelSelectorGroup>
            ))}
          </ModelSelectorList>
        </Command>
      </CardContent>
    </Card>
  )
}
