import { MessageScrollerDemo } from "@/app/demo/[name]/ui/message-scroller-demo"

export const messageScroller = {
  name: "message-scroller",
  components: {
    Chat: (
      <div className="flex w-full items-center justify-center p-6">
        <MessageScrollerDemo />
      </div>
    ),
  },
}
