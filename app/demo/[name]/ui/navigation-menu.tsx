import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export const navigationMenu = {
  name: "navigation-menu",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-64 gap-1">
                  <li>
                    <NavigationMenuLink
                      href="#"
                      className="flex-col items-start gap-1"
                    >
                      <div className="font-medium">Analytics</div>
                      <p className="text-xs leading-snug text-muted-foreground">
                        Real-time dashboards for your product data.
                      </p>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      href="#"
                      className="flex-col items-start gap-1"
                    >
                      <div className="font-medium">Automation</div>
                      <p className="text-xs leading-snug text-muted-foreground">
                        Build workflows that run themselves.
                      </p>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      href="#"
                      className="flex-col items-start gap-1"
                    >
                      <div className="font-medium">Reports</div>
                      <p className="text-xs leading-snug text-muted-foreground">
                        Scheduled exports and summaries.
                      </p>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-56 gap-1">
                  <li>
                    <NavigationMenuLink href="#">
                      Documentation
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="#">Blog</NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="#">Changelog</NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    ),
  },
}
