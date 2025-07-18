import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { fetchUsersPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { UsersTableSkeleton } from '@/app/ui/skeletons';
import UserTable from '@/app/ui/users/table';
import RoleFilter from '@/app/ui/users/role-filter';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function Page({ searchParams }: {searchParams?: any}) {
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;
  const role = searchParams?.role ?? '';

  const totalPages = await fetchUsersPages(query, role);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>Users</h1>

      <RoleFilter/>

      <div className="mt-2 flex justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..."/>
      </div>
      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton/>}>
        <UserTable query={query} currentPage={currentPage} role={role}/>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages}/>
      </div>
    </div>
  );
}
