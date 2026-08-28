"use client";

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/chat/chain-of-thought";
import { Image01Icon, Search01Icon } from "@hugeicons/core-free-icons";

const ChainOfThoughtExample = () => (
  <ChainOfThought defaultOpen>
    <ChainOfThoughtHeader />
    <ChainOfThoughtContent>
      <ChainOfThoughtStep
        icon={Search01Icon}
        label="Searching for profiles for Hayden Bleasel"
        status="complete"
      >
        <ChainOfThoughtSearchResults>
          {[
            "https://www.x.com",
            "https://www.instagram.com",
            "https://www.github.com",
          ].map((website) => (
            <ChainOfThoughtSearchResult key={website}>
              {new URL(website).hostname}
            </ChainOfThoughtSearchResult>
          ))}
        </ChainOfThoughtSearchResults>
      </ChainOfThoughtStep>

      <ChainOfThoughtStep
        icon={Image01Icon}
        label="Found the profile photo for Hayden Bleasel"
        status="complete"
      >
       
      </ChainOfThoughtStep>

      <ChainOfThoughtStep
        label="Hayden Bleasel is an Australian product designer, software engineer, and founder. He is currently based in the United States working for Vercel, an American cloud application company."
        status="complete"
      />

      <ChainOfThoughtStep
        icon={Search01Icon}
        label="Searching for recent work..."
        status="active"
      >
        <ChainOfThoughtSearchResults>
          {["https://www.github.com", "https://www.dribbble.com"].map(
            (website) => (
              <ChainOfThoughtSearchResult key={website}>
                {new URL(website).hostname}
              </ChainOfThoughtSearchResult>
            )
          )}
        </ChainOfThoughtSearchResults>
      </ChainOfThoughtStep>
    </ChainOfThoughtContent>
  </ChainOfThought>
);

export default ChainOfThoughtExample;
