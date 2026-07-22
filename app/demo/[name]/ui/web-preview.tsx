
"use client";

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "@/components/ai-elements/web-preview";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cursor02Icon,
  LinkSquare02Icon,
  Maximize01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useState } from "react";

const handleUrlChange = (url: string) => {
  console.log("URL changed to:", url);
};

const handleGoBack = () => {
  console.log("Go back");
};

const handleGoForward = () => {
  console.log("Go forward");
};

const handleReload = () => {
  console.log("Reload");
};

const handleSelect = () => {
  console.log("Select");
};

const handleOpenInNewTab = () => {
  console.log("Open in new tab");
};

const exampleLogs = [
  {
    level: "log" as const,
    message: "Page loaded successfully",
    timestamp: new Date(Date.now() - 10_000),
  },
  {
    level: "warn" as const,
    message: "Deprecated API usage detected",
    timestamp: new Date(Date.now() - 5000),
  },
  {
    level: "error" as const,
    message: "Failed to load resource",
    timestamp: new Date(),
  },
];

const Example = () => {
  const [_fullscreen, setFullscreen] = useState(false);

  const handleToggleFullscreen = useCallback(
    () => setFullscreen((prev) => !prev),
    []
  );

  return (
    <WebPreview
      defaultUrl="/"
      onUrlChange={handleUrlChange}
      style={{ height: "400px" }}
    >
      <WebPreviewNavigation>
        <WebPreviewNavigationButton onClick={handleGoBack} tooltip="Go back">
          <HugeiconsIcon className="size-4" icon={ArrowLeft01Icon} />
        </WebPreviewNavigationButton>
        <WebPreviewNavigationButton
          onClick={handleGoForward}
          tooltip="Go forward"
        >
          <HugeiconsIcon className="size-4" icon={ArrowRight01Icon} />
        </WebPreviewNavigationButton>
        <WebPreviewNavigationButton onClick={handleReload} tooltip="Reload">
          <HugeiconsIcon className="size-4" icon={RefreshIcon} />
        </WebPreviewNavigationButton>
        <WebPreviewUrl />
        <WebPreviewNavigationButton onClick={handleSelect} tooltip="Select">
          <HugeiconsIcon className="size-4" icon={Cursor02Icon} />
        </WebPreviewNavigationButton>
        <WebPreviewNavigationButton
          onClick={handleOpenInNewTab}
          tooltip="Open in new tab"
        >
          <HugeiconsIcon className="size-4" icon={LinkSquare02Icon} />
        </WebPreviewNavigationButton>
        <WebPreviewNavigationButton
          onClick={handleToggleFullscreen}
          tooltip="Maximize"
        >
          <HugeiconsIcon className="size-4" icon={Maximize01Icon} />
        </WebPreviewNavigationButton>
      </WebPreviewNavigation>

      <WebPreviewBody src="https://preview-v0me-kzml7zc6fkcvbyhzrf47.vusercontent.net/" />

      <WebPreviewConsole logs={exampleLogs} />
    </WebPreview>
  );
};

export default Example;
