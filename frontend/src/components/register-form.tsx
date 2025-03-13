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
import AxiosRequest from '@/services/AxiosInstence';
import { AxiosInstance } from 'axios';
import {
  ChangeEvent,
  createRef,
  forwardRef,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { delay, motion } from 'motion/react';
import { AlertBox } from './ui/common/AlertBox';
import { BanIcon } from 'lucide-react';

interface IValidationError {
  msg: string;
  fieldId: string;
}

export function TabsDemo({
  onTabChange,
}: {
  onTabChange: (value: string) => void;
}) {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [repeatPassword, setRepeatPassword] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const axiosInstance: AxiosInstance = AxiosRequest().axiosInstance;
  const [alertOpen, setAlertOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<IValidationError[]>(
    [],
  );

  const ValidateErrorElement = ({
    eleFieldId,
    errorList,
  }: {
    eleFieldId: string;
    errorList: IValidationError[];
  }) => {
    const fieldErrors = errorList.filter(
      (ve) => (ve.fieldId as string) === eleFieldId,
    );
    return fieldErrors.length > 0 ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, delay: 0.5 }}
        className="bg-red-50 border border-red-200 rounded-md p-3 mb-3"
      >
        <h4 className="text-sm font-medium text-red-800 mb-1">
          Fix the bellow issues of this field:
        </h4>
        <ul className="text-xs text-red-700 list-disc pl-4 space-y-1">
          {fieldErrors.map((error, index) => (
            <li key={index}>{error.msg}</li>
          ))}
        </ul>
      </motion.div>
    ) : (
      <></>
    );
  };

  useEffect(() => {
    validations();
  }, [email, password, repeatPassword, firstName, lastName, username]);

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
  };

  const validations = () => {
    let isValid = true;
    if (username && username.length < 3) {
      setValidationErrors([
        {
          ...validationErrors,
          fieldId: 'username',
          msg: 'Username must be at least 3 characters',
        },
      ]);
      isValid = false;
    }
    if (password !== repeatPassword) {
      setValidationErrors([
        {
          ...validationErrors,
          fieldId: 'password',
          msg: 'Passwords do not match',
        },
      ]);
      isValid = false;
    }
    if (email && email.length < 3) {
      setValidationErrors([
        {
          ...validationErrors,
          fieldId: 'email',
          msg: 'Email must be at least 3 characters',
        },
      ]);
      isValid = false;
    }
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false) {
      setValidationErrors([
        { ...validationErrors, fieldId: 'email', msg: 'Email is not valid' },
      ]);
      isValid = false;
    }
    if (firstName && firstName.length < 3) {
      setValidationErrors([
        {
          ...validationErrors,
          fieldId: 'fname',
          msg: 'First name must be at least 3 characters',
        },
      ]);
      isValid = false;
    }
    if (lastName && lastName.length < 3) {
      setValidationErrors([
        {
          ...validationErrors,
          fieldId: 'lname',
          msg: 'Last name must be at least 3 characters',
        },
      ]);
      isValid = false;
    }
    if (password && password.length < 6) {
      setValidationErrors([
        {
          ...validationErrors,
          fieldId: 'password',
          msg: 'Password must be at least 6 characters',
        },
      ]);
      isValid = false;
    }
    if (isValid) {
      setValidationErrors([]);
    }
    return isValid;
  };

  const handleRegister = (userType: string) => {
    console.log('Registering', userType);
    if (validations()) {
      axiosInstance
        .post('/auth/register', {
          email: email,
          password: password,
          username: username,
          firstName: firstName,
          lastName: lastName,
          role: userType,
        })
        .then((response) => {
          console.log('Registered', response);
        })
        .catch((error) => {
          setMsg('Server error: ' + error);
          setAlertOpen(true);
        });
    } else {
      setMsg(
        'Validation failed: Please resolve the error messages in the form',
      );
      setAlertOpen(true);
    }
  };

  const errorIcon = <BanIcon className="w-6 h-6 text-red-500" />;

  return (
    <>
      <AlertBox
        onAlertOpenChange={setAlertOpen}
        IconElement={errorIcon}
        alertOpen={alertOpen}
        title="Error"
        message={msg}
      />
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
              <ValidateErrorElement
                eleFieldId="fname"
                errorList={validationErrors}
              />
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lname"
                  onChange={(e) => handleInputType(e)}
                  placeholder="Duarte"
                />
              </div>
              <ValidateErrorElement
                eleFieldId="lname"
                errorList={validationErrors}
              />
              <div className="space-y-1">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="email"
                  onChange={(e) => handleInputType(e)}
                  placeholder="peduarte@gmail.com"
                />
              </div>
              <ValidateErrorElement
                eleFieldId="email"
                errorList={validationErrors}
              />
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  onChange={(e) => handleInputType(e)}
                  placeholder="@peduarte"
                />
              </div>
              <ValidateErrorElement
                eleFieldId="username"
                errorList={validationErrors}
              />
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  onChange={(e) => handleInputType(e)}
                  placeholder="Enter your password"
                />
              </div>
              <ValidateErrorElement
                eleFieldId="password"
                errorList={validationErrors}
              />
              <div className="space-y-1">
                <Label htmlFor="password">Repeat Password</Label>
                <Input
                  id="repeat_password"
                  onChange={(e) => handleInputType(e)}
                  placeholder="Repeat your password"
                />
              </div>
              <ValidateErrorElement
                eleFieldId="repeat-password"
                errorList={validationErrors}
              />
            </CardContent>
            <CardFooter className="px-0">
              <Button
                className=" w-full"
                onClick={() => handleRegister('BIDDER')}
              >
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
                onClick={() => handleRegister('SELLER')}
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
    </>
  );
}
