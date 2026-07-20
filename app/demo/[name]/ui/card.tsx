import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const card = {
  name: "card",
  components: {
    Default: (
      <div className="flex w-full items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="card-demo-email">Email</Label>
                <Input
                  id="card-demo-email"
                  type="email"
                  placeholder="m@example.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <Label htmlFor="card-demo-password">Password</Label>
                  <a
                    href="#"
                    className="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="card-demo-password" type="password" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button className="w-full">Login</Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    ),
    Small: (
      <div className="flex w-full items-center justify-center p-6">
        <Card size="sm" className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Weekly digest</CardTitle>
            <CardDescription>Sent every Monday morning</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            A compact card using the small size with tighter spacing, ideal for
            dense settings panels and lists.
          </CardContent>
        </Card>
      </div>
    ),
  },
}
