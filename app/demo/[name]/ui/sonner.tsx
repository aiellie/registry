import { SonnerDemo } from "@/app/demo/[name]/ui/sonner-demo"
import { Toaster } from "@/components/ui/sonner"

export const sonner = {
  name: "sonner",
  components: {
    Toasts: (
      <div className="flex w-full items-center justify-center p-6">
        <SonnerDemo />
        <Toaster />
      </div>
    ),
  },
}
