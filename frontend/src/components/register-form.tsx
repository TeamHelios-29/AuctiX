import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TabsDemo({
  onTabChange,
}: {
  onTabChange: (value: string) => void;
}) {
  return (
    <Tabs
      defaultValue="Buyers"
      className="w-[350px]"
      onValueChange={onTabChange}
    >
      <div className="text-center py-2 text-slate-950 text-2xl font-semibold font-['Geist'] leading-normal">
        Create your account
      </div>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Buyers">Buyers</TabsTrigger>
        <TabsTrigger value="Sellers">Sellers</TabsTrigger>
      </TabsList>
      <TabsContent value="Buyers">
        <Card className="border-none shadow-none">
          {/* <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader> */}
          <CardContent className="space-y-2 py-5 px-0">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="name" placeholder="Pedro" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="name" placeholder="Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="@peduarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Enter your password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Repeat Password</Label>
              <Input id="password" placeholder="Repeat your password" />
            </div>
          </CardContent>
          <CardFooter className="px-0">
            <Button className=" w-full">Sign up</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Sellers">
        <Card className="border-none shadow-none">
          <CardContent className="space-y-2 py-5 px-0">
            <div className="space-y-1">
              <Label htmlFor="firstName">Business Name</Label>
              <Input id="name" placeholder="Global" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="@globalLK" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Enter your password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Repeat Password</Label>
              <Input id="password" placeholder="Repeat your password" />
            </div>
          </CardContent>
          <CardFooter className="px-0 flex flex-col">
            <Button className=" w-full">Sign up</Button>
            <Button
              variant="secondary"
              className="w-full mt-2 flex items-center justify-center"
            >
              Sign up with Google
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
