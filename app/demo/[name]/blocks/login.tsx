import { LoginPage } from "@/app/demo/[name]/blocks/login-page"
import MinimalLayout from "@/app/demo/[name]/blocks/minimal-layout"

export const login = {
  name: "login",
  components: {
    Default: (
      <MinimalLayout>
        <LoginPage />
      </MinimalLayout>
    ),
  },
}
