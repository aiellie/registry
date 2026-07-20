import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const accordion = {
  name: "accordion",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <Accordion defaultValue={["item-1"]} className="w-full max-w-md">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern and is fully
              keyboard navigable.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that match the rest of the
              design system.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. The panel expands and collapses with a smooth height
              animation by default.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
    Multiple: (
      <div className="flex w-full justify-center p-6">
        <Accordion
          multiple
          defaultValue={["shipping", "returns"]}
          className="w-full max-w-md"
        >
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping</AccordionTrigger>
            <AccordionContent>
              Orders ship within 2 business days. Free shipping on orders over
              $50.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>Returns</AccordionTrigger>
            <AccordionContent>
              Returns are accepted within 30 days of delivery, no questions
              asked.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>Support</AccordionTrigger>
            <AccordionContent>
              Our support team is available around the clock via chat and
              email.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
  },
}
