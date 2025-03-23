import {
  Command,
  //   CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/molecules/command';

export function Navbar({}: React.ComponentPropsWithoutRef<'Navbar'>) {
  return (
    <div>
      <div className=" w-full -mt-[86px] h-[86px] bg-white/70 backdrop-blur-[20px] justify-center items-center inline-flex overflow-hidden fixed">
        <div className="h-10 justify-between items-center inline-flex gap-14">
          <div className="justify-center items-center flex pb-1">
            <span className="text-black text-4xl font-normal font-productsans leading-normal">
              Aucti
            </span>
            <span className="text-[#ecb02d] text-4xl font-normal font-productsans leading-normal">
              X
            </span>
          </div>
          <div className="justify-start items-start gap-3 flex">
            <a
              href="/"
              className="px-4 py-2 rounded-md justify-start items-center flex"
            >
              <div className="px-1 justify-start items-center flex">
                <div className="text-slate-950 text-sm font-medium font-['Geist'] leading-tight">
                  Home
                </div>
              </div>
            </a>
            <a
              href="/explore"
              className="px-4 py-2 rounded-md justify-start items-center flex"
            >
              <div className="px-1 justify-start items-center flex">
                <div className="text-slate-950 text-sm font-medium font-['Geist'] leading-tight">
                  Explore
                </div>
              </div>
            </a>
            <a
              href="/dashboard"
              className="px-4 py-2 rounded-md justify-start items-center flex"
            >
              <div className="px-1 justify-start items-center flex">
                <div className="text-slate-950 text-sm font-medium font-['Geist'] leading-tight">
                  Dashboard
                </div>
              </div>
            </a>
            <a
              href="/about"
              className="px-4 py-2 rounded-md justify-start items-center flex"
            >
              <div className="px-1 justify-start items-center flex">
                <div className="text-slate-950 text-sm font-medium font-['Geist'] leading-tight">
                  About us
                </div>
              </div>
            </a>
          </div>
          <div className="justify-start items-center flex overflow-hidden">
            <Command className="w-96 h-10 justify-center bg-gray-100">
              <CommandInput placeholder="Type a command or search..." />
            </Command>
          </div>
          <div data-svg-wrapper>
            <svg
              width="100"
              height="24"
              viewBox="0 0 100 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.33333 20.0909C10.041 20.6562 10.9755 21 12 21C13.0245 21 13.959 20.6562 14.6667 20.0909M4.50763 17.1818C4.08602 17.1818 3.85054 16.5194 4.10557 16.1514C4.69736 15.2975 5.26855 14.0451 5.26855 12.537L5.29296 10.3517C5.29296 6.29145 8.29581 3 12 3C15.7588 3 18.8058 6.33993 18.8058 10.4599L18.7814 12.537C18.7814 14.0555 19.3329 15.3147 19.9006 16.169C20.1458 16.5379 19.9097 17.1818 19.4933 17.1818H4.50763Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M48 10H52M57 7V4C57 3.73478 56.8946 3.48043 56.7071 3.29289C56.5196 3.10536 56.2652 3 56 3H54C53.7348 3 53.4804 3.10536 53.2929 3.29289C53.1054 3.48043 53 3.73478 53 4V7M57 7C57.2652 7 57.5196 7.10536 57.7071 7.29289C57.8946 7.48043 58 7.73478 58 8V10.32C58 12.187 60 13.759 60 15.149V19C60 19.5304 59.7893 20.0391 59.4142 20.4142C59.0391 20.7893 58.5304 21 58 21H54C53.4696 21 52.9609 20.7893 52.5858 20.4142C52.2107 20.0391 52 19.5304 52 19V8C52 7.73478 52.1054 7.48043 52.2929 7.29289C52.4804 7.10536 52.7348 7 53 7M57 7H53M60 16H40M43 7C42.7348 7 42.4804 7.10536 42.2929 7.29289C42.1054 7.48043 42 7.73478 42 8V10.32C42 12.187 40 13.759 40 15.149V19C40 19.5304 40.2107 20.0391 40.5858 20.4142C40.9609 20.7893 41.4696 21 42 21H46C46.5304 21 47.0391 20.7893 47.4142 20.4142C47.7893 20.0391 48 19.5304 48 19V8C48 7.73478 47.8946 7.48043 47.7071 7.29289C47.5196 7.10536 47.2652 7 47 7M43 7H47M43 7V4C43 3.73478 43.1054 3.48043 43.2929 3.29289C43.4804 3.10536 43.7348 3 44 3H46C46.2652 3 46.5196 3.10536 46.7071 3.29289C46.8946 3.48043 47 3.73478 47 4V7"
                stroke="#020617"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g clip-path="url(#clip0_25_597)">
                <path
                  opacity="0.4"
                  d="M88 24C94.6274 24 100 18.6275 100 12C100 5.37258 94.6274 0 88 0C81.3726 0 76 5.37258 76 12C76 18.6275 81.3726 24 88 24Z"
                  fill="#FFAE00"
                />
                <path
                  d="M88 5.91618C85.516 5.91618 83.5 7.93218 83.5 10.4161C83.5 12.8521 85.408 14.8321 87.94 14.9041C87.976 14.9041 88.024 14.9041 88.048 14.9041C88.072 14.9041 88.108 14.9041 88.132 14.9041C88.144 14.9041 88.156 14.9041 88.156 14.9041C90.58 14.8201 92.488 12.8521 92.5 10.4161C92.5 7.93218 90.484 5.91618 88 5.91618Z"
                  fill="#292D32"
                />
                <path
                  d="M96.1369 20.8197C94.0009 22.7877 91.1449 23.9997 88.0009 23.9997C84.8569 23.9997 82.0009 22.7877 79.8649 20.8197C80.1529 19.7277 80.9329 18.7317 82.0729 17.9637C85.3489 15.7797 90.6769 15.7797 93.9289 17.9637C95.0809 18.7317 95.8489 19.7277 96.1369 20.8197Z"
                  fill="#292D32"
                />
              </g>
              <defs>
                <clipPath id="clip0_25_597">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(76)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
