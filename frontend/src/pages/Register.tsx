import { useState } from 'react';
import { TabsDemo } from '../components/register-form';

export default function Register() {
  const [selectedTab, setSelectedTab] = useState('Buyers');

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            {/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div> */}
            <div className="text-3xl leading-none font-normal font-productsans">
              Aucti
              <span className="text-[#FFD21E] font-normal font-productsans">
                X
              </span>
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <TabsDemo onTabChange={handleTabChange} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={
            selectedTab === 'Buyers'
              ? '/buyerRegister.jpg'
              : '/sellerRegister.jpg'
          }
          alt={
            selectedTab === 'Buyers'
              ? 'Buyer Registration'
              : 'Seller Registration'
          }
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
