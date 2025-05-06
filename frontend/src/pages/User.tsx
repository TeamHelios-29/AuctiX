import UserDataTable from '@/components/organisms/userDataTable';

export default function User() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <h1 className="text-1xl mt-5">User Modules</h1>
      <UserDataTable />
    </div>
  );
}
