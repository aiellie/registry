import ChatPage from "@/app/demo/[name]/blocks/chat-page"
import ShellLayout from "@/app/demo/[name]/blocks/shell-layout"

export const chat = {
  name: "chat",
  components: {
    Default: (
      <ShellLayout activeHref="#chat">
        <ChatPage />
      </ShellLayout>
    ),
  },
}
