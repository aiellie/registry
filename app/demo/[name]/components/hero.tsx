import { Hero } from "@/components/hero"

export const hero = {
  name: "hero",
  components: {
    Default: (
      <Hero
        badgeText="Registry"
        title="AIEllie UI"
        description="This starter helps you create a registry so you can distribute your custom components, hooks, pages, and other files to any React project"
        buttonText="Explore Components"
        buttonLink="/registry"
      />
    ),
  },
}
