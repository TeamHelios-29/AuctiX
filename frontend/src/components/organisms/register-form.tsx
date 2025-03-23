import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardFooter } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/atoms/tabs';
import { AxiosInstance } from 'axios';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { delay, motion } from 'motion/react';
import { Octagon, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/hooks';
import { jwtDecode } from 'jwt-decode';
import { IJwtData } from '@/Interfaces/IJwtData';
import { IAuthUser } from '@/Interfaces/IAuthUser';
import { login } from '@/store/slices/authSlice';
import { AlertBox } from './AlertBox';
import AxiosReqest from '@/services/axiosInspector';

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
  const axiosInstance: AxiosInstance = AxiosReqest().axiosInstance;
  const [alertOpen, setAlertOpen] = useState(false);
  const [AlertIcon, setAlertIcon] = useState<React.ReactNode>(null);
  const [msg, setMsg] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [validationErrors, setValidationErrors] = useState<IValidationError[]>(
    [],
  );
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const isLoginSuccessRef = useRef(isLoginSuccess);

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
    const initProps = {
      opacity: 1,
      scale: 1,
    };
    const animateProps = {
      opacity: [1, 0.9, 1],
      scale: [1, 1.06, 1],
    };
    return fieldErrors.length > 0 ? (
      <motion.div
        key={eleFieldId + '-errors' + fieldErrors.length}
        initial={initProps}
        animate={animateProps}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.5, exit: { duration: 1.5 } }}
        className="bg-red-50 border border-red-200 rounded-md p-3 mb-3"
      >
        <h4 className="text-sm font-medium text-red-800 mb-1">
          Check the input field rules:
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
  useEffect(() => {
    isLoginSuccessRef.current = isLoginSuccess;
  }, [isLoginSuccess]);

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
    let errorList: IValidationError[] = [];

    if (username && username.length < 3) {
      errorList.push({
        fieldId: 'username',
        msg: 'Username must be at least 3 characters',
      });
      isValid = false;
    }

    if (repeatPassword && password !== repeatPassword) {
      errorList.push({
        fieldId: 'repeat-password',
        msg: 'Passwords do not match',
      });
      isValid = false;
    }

    if (email && email.length < 3) {
      errorList.push({
        fieldId: 'email',
        msg: 'Email must be at least 3 characters',
      });
      isValid = false;
    }

    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false) {
      errorList.push({
        fieldId: 'email',
        msg: 'Email is not valid',
      });
      isValid = false;
    }

    if (firstName && firstName.length < 3) {
      errorList.push({
        fieldId: 'fname',
        msg: 'First name must be at least 3 characters',
      });
      isValid = false;
    }

    if (lastName && lastName.length < 3) {
      errorList.push({
        fieldId: 'lname',
        msg: 'Last name must be at least 3 characters',
      });
      isValid = false;
    }

    if (password && password.length < 6) {
      errorList.push({
        fieldId: 'password',
        msg: 'Password must be at least 6 characters',
      });
      isValid = false;
    }

    // Update validation errors with the complete list
    setValidationErrors(errorList);

    return isValid;
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
          setIsLoginSuccess(true);
          showSuccessAlert('Account created successfully');
          const token = response.data;
          console.log('token:', token);
          const decoded = jwtDecode(token) as IJwtData;
          console.log('decoded token:', decoded);
          dispatch(
            login({
              token: token,
              username: decoded.username,
              role: decoded.role,
            } as IAuthUser),
          );
          console.log('Logged in');
          // navigate('/dashboard');
        })
        .catch((error) => {
          showErrorAlert(
            'Error: ' +
              (error.response?.data || error.message || 'Unknown error'),
          );
        });
    } else {
      showErrorAlert(
        'Validation failed: Please resolve the error messages in the form',
      );
    }
  };

  const ErrorIcon = <Octagon className="w-6 h-6 text-red-500" />;
  const SuccessIcon = <Scale className="w-6 h-6 text-green-500" />;

  const showErrorAlert = (msg: string) => {
    setAlertTitle('Error');
    setAlertIcon(ErrorIcon);
    setMsg(msg);
    setAlertOpen(true);
  };

  const showSuccessAlert = (msg: string) => {
    setAlertTitle('Success');
    setAlertIcon(SuccessIcon);
    setMsg(msg);
    setAlertOpen(true);
  };

  const handleAccept = () => {
    console.log('Accepting alert', isLoginSuccessRef.current);
    if (isLoginSuccessRef.current) {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <AlertBox
        onAlertOpenChange={setAlertOpen}
        IconElement={AlertIcon}
        alertOpen={alertOpen}
        title={alertTitle}
        message={msg}
        continueBtn="Ok"
        continueAction={handleAccept}
        cancelBtn={null}
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
            <CardFooter className="px-0 flex flex-col">
              <Button
                className="w-full"
                onClick={() => handleRegister('BIDDER')}
              >
                Sign up
              </Button>
              <Button
                variant="secondary"
                className="w-full mt-2 flex items-center justify-center"
              >
                Sign up with Google
              </Button>
              <div className="text-center text-sm mt-2">
                Already have an account?
                <a href="/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
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
                  placeholder="@globalLK"
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
            <CardFooter className="px-0 flex flex-col">
              <Button
                className="w-full"
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
              <div className="text-center text-sm mt-2">
                Already have an account?
                <a href="/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
