"use client"

import * as React from "react"

import { Example, ExampleWrapper } from "@/components/example"
import {
  DEFAULT_SETTINGS,
  IconPicker,
  type IconPickerItem,
  type IconPickerSettings,
} from "@/components/icon-picker"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"

export default function IconPickerExample() {
  const [icon, setIcon] = React.useState<IconPickerItem | null>(null)
  const [settings, setSettings] =
    React.useState<IconPickerSettings>(DEFAULT_SETTINGS)

  return (
    <ExampleWrapper>
      <Example title="Default">
        <IconPicker />
      </Example>

      <Example title="Controlled">
        <Field>
          <FieldLabel>Project icon</FieldLabel>
          <IconPicker
            value={icon}
            onValueChange={setIcon}
            onSettingsChange={setSettings}
          />
          <FieldDescription>
            {icon ? (
              <span className="font-mono">{icon.id}</span>
            ) : (
              "Nothing picked yet."
            )}
          </FieldDescription>
          <FieldDescription className="font-mono">
            {settings.strokeWidth} · {settings.size}px ·{" "}
            {settings.color ?? "auto"}
          </FieldDescription>
        </Field>
      </Example>

      <Example title="Opens on Models">
        <IconPicker defaultTab="models" placeholder="Pick a provider" />
      </Example>

      <Example title="Opens on Extensions">
        <IconPicker defaultTab="extensions" placeholder="Pick a file type" />
      </Example>
    </ExampleWrapper>
  )
}
