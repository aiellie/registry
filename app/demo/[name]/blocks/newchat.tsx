import NewChatPage from "@/app/demo/[name]/blocks/newchat-page"
import ShellLayout from "@/app/demo/[name]/blocks/shell-layout"

export const newchat = {
  name: "newchat",
  components: {
    Default: (
      <ShellLayout activeHref="#chat">
        <NewChatPage />
      </ShellLayout>
    ),
  },
}
