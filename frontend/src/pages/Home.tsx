import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/molecules/navbar';
import { ReactNode } from 'react';

export default function Home(): ReactNode {
  return (
    <div>
      <div>
        <Navbar />

        <div className="bg-[linear-gradient(to_right_bottom,rgba(251,204,64,0.9),rgba(253,235,173,0.9)),url('/heroimage.jpg')] bg-cover flex flex-col items-center justify-center mt-[86px] h-[530px]">
          <div className="flex-col text-center items-center gap-1.5 ">
            <div className="self-stretch text-center">
              <span className="text-slate-950 text-6xl font-medium font-['Geist'] leading-[60px]">
                Discover, Bid, and Win
                <br />
                with Confidence on
                <br />
              </span>
              <span className="text-slate-950 text-8xl font-normal font-['Geist'] leading-[96px]">
                Aucti
              </span>
              <span className="text-[#eaac26] text-8xl font-normal font-['Geist'] leading-[96px]">
                X
              </span>
              <span className="text-slate-950 text-8xl font-normal font-['Geist'] leading-[96px]">
                !
              </span>
            </div>
          </div>
          <div className="flex-col text-center items-center mt-10">
            <Button className="mx-3 w-48">
              Sign Up Now!{' '}
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.50002 10L6.50002 8.00002M8.50002 10C9.43125 9.64585 10.3246 9.19917 11.1667 8.66669M8.50002 10V13.3334C8.50002 13.3334 10.52 12.9667 11.1667 12C11.8867 10.92 11.1667 8.66669 11.1667 8.66669M6.50002 8.00002C6.85478 7.07964 7.30149 6.1974 7.83335 5.36669C8.61014 4.12468 9.69177 3.10206 10.9754 2.39608C12.2589 1.69011 13.7018 1.32427 15.1667 1.33336C15.1667 3.14669 14.6467 6.33336 11.1667 8.66669M6.50002 8.00002L3.16669 8.00003C3.16669 8.00003 3.53335 5.98003 4.50002 5.33337C5.58002 4.61337 7.83335 5.33337 7.83335 5.33337M3.50002 11.0001C2.50002 11.8401 2.16669 14.3334 2.16669 14.3334C2.16669 14.3334 4.66002 14.0001 5.50002 13.0001C5.97335 12.4401 5.96669 11.5801 5.44002 11.0601C5.18089 10.8127 4.83955 10.6698 4.4815 10.6588C4.12346 10.6477 3.77394 10.7692 3.50002 11.0001Z"
                  stroke="#F8FAFC"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Button>
            <Button variant="secondary" className="mx-3 w-48">
              Explore Auctions{' '}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 5.33333H10.6667M5.33333 8H9.33333M7.33333 10.6667H10.6667M3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V12.6667C14 13.403 13.403 14 12.6667 14H3.33333C2.59695 14 2 13.403 2 12.6667V3.33333C2 2.59695 2.59695 2 3.33333 2Z"
                  stroke="#020617"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center py-20 pt-36">
          <div className="self-stretch text-center">
            <span className="text-slate-950 text-7xl font-bold font-['Geist'] leading-[9px]">
              Why Choose
              <br />
            </span>
            <span className="text-slate-950 text-7xl font-normal font-['Geist'] leading-[96px]">
              Aucti
            </span>
            <span className="text-[#ecb02d] text-7xl font-normal font-['Geist'] leading-[96px]">
              X
            </span>
            <span className="text-slate-950 text-7xl font-bold font-['Geist'] leading-[96px]">
              ?
            </span>
          </div>
          <div className="self-stretch text-center text-slate-500 text-2xl font-normal font-['Geist'] leading-normal">
            Explore the features that make us the most trusted auction platform.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 p-5 text-left">
            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Category-Based Search</h3>
                <p className="text-gray-600 text-md mt-2">
                  Find what you’re looking for with our intuitive category
                  filters.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold ">Real-Time Notifications</h3>
                <p className="text-gray-600 text-md mt-2">
                  Stay updated on bids, auctions, and deals with instant alerts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Transparent Auctions</h3>
                <p className="text-gray-600 text-md mt-2">
                  Interact directly with sellers through our integrated chat
                  feature.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Trust & Security</h3>
                <p className="text-gray-600 text-md mt-2">
                  Your transactions are safe with us. Funds are released to
                  sellers only after product delivery confirmation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 py-10">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="mt-6 space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Are there any fees for sellers or buyers?
              </AccordionTrigger>
              <AccordionContent>
                No, there are no fees for buyers or sellers on AuctiX.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                How do I start bidding on AuctiX?
              </AccordionTrigger>
              <AccordionContent>
                Simply create an account, browse available auctions, and place
                your bid.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                What happens if I don’t receive my product?
              </AccordionTrigger>
              <AccordionContent>
                If you don’t receive your product, contact our support team for
                assistance with refunds or disputes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex items-center justify-center rounded-lg bg-[#ecb02d] py-10 m-20">
          <div className="w-full max-w-2xl p-8 text-center">
            <h2 className="text-white text-xl md:text-2xl  mb-6">
              We value your thoughts! Your feedback is crucial in helping us
              improve and provide a better experience. Whether you have
              suggestions, compliments, or concerns, we’d love to hear from you.
            </h2>
            <Textarea
              placeholder="Type your feedback"
              className="w-full p-4 text-gray-700 bg-white rounded-md "
            />
            <Button className="mt-4 px-10">Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
