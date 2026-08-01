import {
  AnimatedBots,
  Bot,
  CarrierBot,
  RollerBot,
  ScoutBot,
} from "@/components/animations/animated-bots"
import { Example, ExampleWrapper } from "@/components/example"

export default function AnimatedBotsExample() {
  return (
    <ExampleWrapper>
      <BotsScene />
      <BotsMarchingInPlace />
      <BotsCustomScene />
    </ExampleWrapper>
  )
}

function BotsScene() {
  return (
    <Example title="Scene" className="p-0" containerClassName="md:col-span-2">
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-x-0 bottom-12 border-t border-dashed" />
        <AnimatedBots className="bottom-12" />
      </div>
    </Example>
  )
}

function BotsMarchingInPlace() {
  return (
    <Example title="Marching in place" className="justify-center">
      <div className="flex items-end justify-center gap-12">
        {(
          [
            ["Carrier", <CarrierBot key="carrier" />],
            ["Roller", <RollerBot key="roller" />],
            ["Scout", <ScoutBot key="scout" />],
          ] as const
        ).map(([label, sprite]) => (
          <figure key={label} className="flex flex-col items-center gap-4">
            <Bot walk={false}>{sprite}</Bot>
            <figcaption className="text-xs text-muted-foreground">
              {label}
            </figcaption>
          </figure>
        ))}
      </div>
    </Example>
  )
}

function BotsCustomScene() {
  return (
    <Example title="Custom scene" className="p-0">
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-x-0 bottom-10 border-t border-dashed" />
        <AnimatedBots className="bottom-10">
          <Bot duration="16s" rest="18cqw">
            <ScoutBot />
          </Bot>
          <Bot duration="28s" delay="-11s" rest="64cqw" facing="left">
            <RollerBot />
          </Bot>
        </AnimatedBots>
      </div>
    </Example>
  )
}
