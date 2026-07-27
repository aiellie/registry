import {
  BrandAvatar,
  brandAvatarStates,
  type BrandAvatarState,
} from "@/components/brand/brand-avatar"
import { Example, ExampleWrapper } from "@/components/example"

export default function BrandAvatarExample() {
  return (
    <ExampleWrapper>
      <BrandAvatarDefault />
      <BrandAvatarSleeping />
      <BrandAvatarExpressions />
      <BrandAvatarReactions />
      <BrandAvatarSizes />
      <BrandAvatarWakeUp />
      <BrandAvatarStatusRows />
      <BrandAvatarAllStates />
    </ExampleWrapper>
  )
}

function StateFigure({
  state,
  size = "size-16",
}: {
  state: BrandAvatarState
  size?: string
}) {
  return (
    <figure className="flex w-auto flex-col items-center gap-2.5">
      <BrandAvatar state={state} className={size} />
      <figcaption className="font-mono text-[10px] tracking-widest text-muted-foreground">
        {state}
      </figcaption>
    </figure>
  )
}

function BrandAvatarDefault() {
  return (
    <Example title="Default" className="items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <BrandAvatar className="size-24" />
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
          [ status: online ]
        </span>
      </div>
    </Example>
  )
}

function BrandAvatarSleeping() {
  return (
    <Example title="Sleeping" className="items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <BrandAvatar state="sleeping" className="size-24" />
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
          ( do not wake )
        </span>
      </div>
    </Example>
  )
}

function BrandAvatarExpressions() {
  return (
    <Example title="Expressions" className="items-center justify-center">
      <div className="flex flex-wrap items-start justify-center gap-8">
        <StateFigure state="happy" />
        <StateFigure state="winking" />
        <StateFigure state="blushing" />
        <StateFigure state="grumpy" />
      </div>
    </Example>
  )
}

function BrandAvatarReactions() {
  return (
    <Example title="Reactions" className="items-center justify-center">
      <div className="flex flex-wrap items-start justify-center gap-8">
        <StateFigure state="yawning" />
        <StateFigure state="startled" />
        <StateFigure state="dizzy" />
      </div>
    </Example>
  )
}

function BrandAvatarSizes() {
  return (
    <Example title="Sizes" className="items-center justify-center">
      <div className="flex items-end gap-6">
        <BrandAvatar className="size-6" />
        <BrandAvatar className="size-8" />
        <BrandAvatar className="size-12" />
        <BrandAvatar className="size-16" />
        <BrandAvatar className="size-24" />
      </div>
    </Example>
  )
}

/** The intro sequence in stills: she was sleeping, you woke her. */
function BrandAvatarWakeUp() {
  const sequence: BrandAvatarState[] = [
    "sleeping",
    "grumpy",
    "yawning",
    "awake",
    "happy",
  ]
  return (
    <Example title="Wake-up Sequence" className="items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {sequence.map((state, i) => (
          <div key={state} className="flex w-auto items-center gap-3">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="font-mono text-xs text-muted-foreground"
              >
                &rarr;
              </span>
            )}
            <StateFigure state={state} size="size-12" />
          </div>
        ))}
      </div>
    </Example>
  )
}

function StatusRow({
  state,
  status,
}: {
  state: BrandAvatarState
  status: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border px-4 py-2.5">
      <BrandAvatar state={state} />
      <span className="text-sm font-medium">aiellie</span>
      <span className="ms-auto font-mono text-[10px] tracking-widest text-muted-foreground">
        {status}
      </span>
    </div>
  )
}

function BrandAvatarStatusRows() {
  return (
    <Example title="As a Presence Indicator">
      <div className="flex w-full flex-col gap-2">
        <StatusRow state="awake" status="[ status: online ]" />
        <StatusRow state="dizzy" status="[ status: dizzy ]" />
        <StatusRow state="sleeping" status="[ status: sleeping ]" />
      </div>
    </Example>
  )
}

function BrandAvatarAllStates() {
  return (
    <Example title="All States" containerClassName="lg:col-span-full">
      <div className="grid w-full grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-5 lg:grid-cols-9">
        {brandAvatarStates.map((state) => (
          <StateFigure key={state} state={state} size="size-14" />
        ))}
      </div>
    </Example>
  )
}
