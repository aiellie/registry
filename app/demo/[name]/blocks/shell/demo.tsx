import ShellPage from "@/app/demo/[name]/blocks/shell/page"
import { PanelShell } from "@/components/panel-shell"

/**
 * Preview only. Consumers get the shell from `registry/layouts/panel-layout.tsx`
 * (installed as `app/layout.tsx`), but the demo iframe has no layout of its own
 * — so the preview wraps the page in `PanelShell` directly.
 */
export const shell = {
  name: "shell",
  components: {
    Default: (
      <PanelShell>
        <ShellPage />
      </PanelShell>
    ),
  },
}
