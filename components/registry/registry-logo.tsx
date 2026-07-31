import { LogoIcon, LogoWordmark } from "@/components/logo";

export function RegistryLogo() {
  return (
    <>
      <div
        data-logo-icon
        className="group flex aspect-square size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg group-data-[collapsible=icon]:size-8"
      >
        <LogoIcon className="!size-full" />
      </div>
      <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
        <LogoWordmark className="text-sm font-medium" />
      </div>
    </>
  );
}
