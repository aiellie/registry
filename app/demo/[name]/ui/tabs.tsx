import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const tabs = {
  name: "tabs",
  components: {
    Default: (
      <div className="flex w-full justify-center p-6">
        <Tabs defaultValue="account" className="w-full max-w-sm">
          <TabsList className="w-full">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you are
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tabs-demo-name">Name</Label>
                  <Input id="tabs-demo-name" defaultValue="Ellie Sophia" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tabs-demo-username">Username</Label>
                  <Input id="tabs-demo-username" defaultValue="@aiellie" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. You will be logged out after
                  saving.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tabs-demo-current">Current password</Label>
                  <Input id="tabs-demo-current" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tabs-demo-new">New password</Label>
                  <Input id="tabs-demo-new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    ),
    Line: (
      <div className="flex w-full justify-center p-6">
        <Tabs defaultValue="overview" className="w-full max-w-sm">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-muted-foreground p-2">
            A quick summary of your workspace activity for the last 30 days.
          </TabsContent>
          <TabsContent value="analytics" className="text-muted-foreground p-2">
            Detailed charts and metrics about traffic and engagement.
          </TabsContent>
          <TabsContent value="reports" className="text-muted-foreground p-2">
            Download monthly reports and export raw data.
          </TabsContent>
        </Tabs>
      </div>
    ),
    Vertical: (
      <div className="flex w-full justify-center p-6">
        <Tabs
          defaultValue="general"
          orientation="vertical"
          className="w-full max-w-sm"
        >
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="text-muted-foreground p-2">
            Manage workspace name, language, and appearance.
          </TabsContent>
          <TabsContent value="team" className="text-muted-foreground p-2">
            Invite teammates and manage their roles.
          </TabsContent>
          <TabsContent value="billing" className="text-muted-foreground p-2">
            View invoices and update your payment method.
          </TabsContent>
        </Tabs>
      </div>
    ),
  },
}
