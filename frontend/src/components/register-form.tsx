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
import { ChangeEvent, useState } from 'react';

export function TabsDemo({
  onTabChange,
}: {
  onTabChange: (value: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleInputType = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.id === 'password') {
      setPassword(e.target.value);
    } else if (e.target.id === 'email') {
      setEmail(e.target.value);
    } else if (e.target.id === 'repeat_password') {
      setRepeatPassword(e.target.value);
    } else if (e.target.id === 'fname') {
      setFirstName(e.target.value);
    } else if (e.target.id === 'lname') {
      setLastName(e.target.value);
    } else if (e.target.id === 'username') {
      setUsername(e.target.value);
    } else {
      console.warn('Input type not handled', e.target.id);
    }

    validations();
  };

  const validations = () => {
    if (password !== repeatPassword) {
      console.log('Passwords do not match');
    }
    if (username.length < 3) {
      console.log('Username must be at least 3 characters');
    }
    if (email.length < 3) {
      console.log('Email must be at least 3 characters');
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false) {
      console.log('Invalid email');
    }
    if (firstName.length < 3) {
      console.log('First name must be at least 3 characters');
    }
    if (lastName.length < 3) {
      console.log('Last name must be at least 3 characters');
    }
    if (password.length < 6) {
      console.log('Password must be at least 6 characters');
    }
  };

  const handleRegister = (userType: string) => {
    console.log('Registering', userType);
    if (validations()) {
    }
  };

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
              <Input
                id="fname"
                onChange={(e) => handleInputType(e)}
                placeholder="Pedro"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lname"
                onChange={(e) => handleInputType(e)}
                placeholder="Duarte"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Email</Label>
              <Input
                id="email"
                onChange={(e) => handleInputType(e)}
                placeholder="peduarte@gmail.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                onChange={(e) => handleInputType(e)}
                placeholder="@peduarte"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                onChange={(e) => handleInputType(e)}
                placeholder="Enter your password"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Repeat Password</Label>
              <Input
                id="repeat_password"
                onChange={(e) => handleInputType(e)}
                placeholder="Repeat your password"
              />
            </div>
          </CardContent>
          <CardFooter className="px-0">
            <Button className=" w-full" onClick={() => handleRegister('Buyer')}>
              Sign up
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="Sellers">
        <Card className="border-none shadow-none">
          <CardContent className="space-y-2 py-5 px-0">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="fname"
                onChange={(e) => handleInputType(e)}
                placeholder="Pedro"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lname"
                onChange={(e) => handleInputType(e)}
                placeholder="Duarte"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Email</Label>
              <Input
                id="email"
                onChange={(e) => handleInputType(e)}
                placeholder="peduarte@gmail.com"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                onChange={(e) => handleInputType(e)}
                placeholder="@globalLK"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                onChange={(e) => handleInputType(e)}
                placeholder="Enter your password"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Repeat Password</Label>
              <Input
                id="repeat_password"
                onChange={(e) => handleInputType(e)}
                placeholder="Repeat your password"
              />
            </div>
          </CardContent>
          <CardFooter className="px-0 flex flex-col">
            <Button
              className=" w-full"
              onClick={() => handleRegister('Seller')}
            >
              Sign up
            </Button>
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
