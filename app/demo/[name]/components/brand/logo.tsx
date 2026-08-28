import { Logo, LogoIcon, LogoWordmark } from "@/components/brand/logo"
import { Example, ExampleWrapper } from "@/components/example"

export default function LogoExample() {
  return (
    <ExampleWrapper>
      <Example title="Lockup" className="items-center justify-center">
        <Logo />
      </Example>
      <Example
        title="Mark — hover to wink"
        className="items-center justify-center"
      >
        <div className="group">
          <LogoIcon role="img" aria-label="Brand logo" className="size-20" />
        </div>
      </Example>
      <Example title="Wordmark" className="items-center justify-center">
        <LogoWordmark className="font-bold" />
      </Example>
      <Example title="Sizes" className="items-center justify-center">
        <div className="group flex items-center gap-6">
          <LogoIcon className="size-6" />
          <LogoIcon className="size-10" />
          <LogoIcon className="size-16" />
        </div>
      </Example>
    </ExampleWrapper>
  )
}
