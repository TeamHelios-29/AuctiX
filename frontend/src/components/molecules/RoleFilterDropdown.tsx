import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface RoleFilterDropdownProps {
  isFilterApplied: (filterCol: string, filterVal: string) => boolean;
  filterByHandler: (
    filterByCol: string,
    filterVal: string,
    isAdded: boolean,
  ) => void;
}

const roleOptions = [
  { id: 'BIDDER', label: 'Bidders' },
  { id: 'SELLER', label: 'Sellers' },
  { id: 'ADMIN', label: 'Admins' },
  { id: 'SUPER_ADMIN', label: 'Super Admins' },
];

export default function RoleFilterDropdown({
  isFilterApplied,
  filterByHandler,
}: RoleFilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          Role
          <Filter className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="p-2">
        {roleOptions.map(({ id, label }) => (
          <DropdownMenuCheckboxItem
            key={id}
            checked={isFilterApplied('role', id)}
            onCheckedChange={(checked) => filterByHandler('role', id, checked)}
            className="capitalize"
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2"
          onClick={() => filterByHandler('NONE', 'NONE', false)}
        >
          Clear Filters
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
