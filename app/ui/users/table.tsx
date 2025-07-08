import { fetchFilteredUsers } from '@/app/lib/data';
import UserStatus from '@/app/ui/users/status';
import { EditUserStatus } from '@/app/ui/users/button';
import { getCurrentUserId } from '@/auth_token';
import Avatar from '@/app/ui/avatar';
import NotFound from "@/app/dashboard/invoices/[id]/edit/not-found";

export default async function UserTable(
  {
    query,
    currentPage,
    role,
  }: {
    query: string;
    currentPage: number;
    role: string;
  }) {
  const users = await fetchFilteredUsers(query, currentPage, role);

  if (users.length === 0) {
    return <NotFound/>;
  }

  const currentUserId = await getCurrentUserId();

  return (
    <div className="mt-6 rounded-lg bg-gray-50 p-2 md:pt-0">
      <div className="md:hidden">
        {users?.map((user) => (
          <div key={user.id} className="mb-2 w-full rounded-md bg-white p-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="mb-2 flex items-center">
                  <Avatar
                    src={user.avatar}
                    className="mr-2 rounded-full"
                    width={28}
                    height={28}
                    alt={`${user.name}'s profile picture`}
                  />
                  <p>
                    {user.name}{' '}
                    {user.user_id === currentUserId && (
                      <span className="font-semibold">(You)</span>
                    )}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <UserStatus status={user.status}/>
            </div>
            <div className="flex w-full items-center justify-between pt-4">
              <div>
                <div className="h-6 w-16 rounded">{user.city}</div>
                <div className="mt-2 h-6 w-24 rounded">{user.role}</div>
              </div>
              <div className="flex justify-end gap-2">
                {user.role !== 'admin' && user.id !== currentUserId && (
                  <EditUserStatus
                    id={user.id}
                    status={user.status}
                    role={user.role}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <table className="hidden min-w-full text-gray-900 md:table">
        <thead className="text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
            User
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Email
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            City
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Role
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Status
          </th>
          <th scope="col" className="relative py-3 pl-6 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
        </thead>
        <tbody className="bg-white">
        {users?.map((user) => (
          <tr
            key={user.id}
            className="border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user.avatar}
                  className="rounded-full"
                  width={28}
                  height={28}
                  alt={`${user.name}'s profile picture`}
                />
                <p>
                  {user.name}{' '}
                  {user.id === currentUserId && (
                    <span className="font-semibold">(You)</span>
                  )}
                </p>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-3">{user.email}</td>
            <td className="whitespace-nowrap px-3 py-3">
              {user.city || '-'}
            </td>
            <td className="whitespace-nowrap px-3 py-3">{user.role}</td>
            <td className="whitespace-nowrap px-3 py-3">
              <UserStatus status={user.status}/>
            </td>
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex min-w-[40px] justify-end gap-3">
                {user.role !== 'admin' && user.id !== currentUserId && (
                  <EditUserStatus
                    id={user.id}
                    status={user.status}
                    role={user.role}
                  />
                )}
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
