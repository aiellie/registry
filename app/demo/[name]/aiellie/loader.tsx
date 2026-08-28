import { Example, ExampleWrapper } from "@/components/example"
import {
  BarsLoader,
  CircularLoader,
  ClassicLoader,
  DotsLoader,
  Loader,
  PulseDotLoader,
  PulseLoader,
  TerminalLoader,
  TextBlinkLoader,
  TextDotsLoader,
  TextShimmerLoader,
  TypingLoader,
  VercelLoader,
  WaveLoader,
} from "@/components/aiellie/loader"

export default function LoaderExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-2 xl:grid-cols-3">
      <LoaderVariants />
      <LoaderSpinners />
      <LoaderDots />
      <LoaderText />
      <LoaderSizes />
    </ExampleWrapper>
  )
}

function LoaderVariants({ className }: { className?: string }) {
  return (
    <Example title="Variants" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-6">
        <CircularLoader />
        <ClassicLoader />
        <VercelLoader />
        <PulseLoader />
        <PulseDotLoader />
        <DotsLoader />
        <TypingLoader />
        <WaveLoader />
        <BarsLoader />
        <TerminalLoader />
      </div>
    </Example>
  )
}

function LoaderSpinners({ className }: { className?: string }) {
  return (
    <Example title="Spinners" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-6">
        <CircularLoader />
        <ClassicLoader />
        <VercelLoader />
        <PulseLoader />
      </div>
    </Example>
  )
}

function LoaderDots({ className }: { className?: string }) {
  return (
    <Example title="Dots" containerClassName={className}>
      <div className="flex flex-wrap items-center gap-6">
        <PulseDotLoader />
        <DotsLoader />
        <TypingLoader />
      </div>
    </Example>
  )
}

function LoaderText({ className }: { className?: string }) {
  return (
    <Example title="Text" containerClassName={className}>
      <div className="flex flex-col gap-4">
        <TextBlinkLoader text="Thinking" />
        <TextShimmerLoader text="Generating" />
        <TextDotsLoader text="Loading" />
        <TerminalLoader />
      </div>
    </Example>
  )
}

function LoaderSizes({ className }: { className?: string }) {
  return (
    <Example title="Sizes" containerClassName={className}>
      <div className="flex flex-wrap items-end gap-6">
        <Loader variant="circular" size="sm" />
        <Loader variant="circular" size="md" />
        <Loader variant="circular" size="lg" />
        <Loader variant="bars" size="sm" />
        <Loader variant="bars" size="md" />
        <Loader variant="bars" size="lg" />
        <Loader variant="wave" size="sm" />
        <Loader variant="wave" size="md" />
        <Loader variant="wave" size="lg" />
      </div>
    </Example>
  )
}
