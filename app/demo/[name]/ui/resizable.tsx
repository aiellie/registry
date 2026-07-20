import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export const resizable = {
  name: "resizable",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-[200px] w-full max-w-md rounded-lg border"
        >
          <ResizablePanel defaultSize="50">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">One</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="50">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="25">
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Two</span>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="75">
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Three</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    ),
    WithHandle: (
      <div className="flex w-full justify-center p-6">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-32 w-full max-w-md rounded-lg border"
        >
          <ResizablePanel defaultSize="25" minSize="15">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Sidebar</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="75">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    ),
  },
}
