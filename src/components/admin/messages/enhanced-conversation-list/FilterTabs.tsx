
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FilterTabsProps {
  filter: 'all' | 'unread' | 'important';
  setFilter: (filter: 'all' | 'unread' | 'important') => void;
  totalUnread: number;
  totalImportant: number;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  filter,
  setFilter,
  totalUnread,
  totalImportant
}) => {
  return (
    <Tabs defaultValue={filter} className="w-full" onValueChange={(value) => setFilter(value as any)}>
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="all" className="text-xs sm:text-sm">
          Tous
        </TabsTrigger>
        <TabsTrigger value="unread" className="text-xs sm:text-sm">
          Non lus ({totalUnread})
        </TabsTrigger>
        <TabsTrigger value="important" className="text-xs sm:text-sm">
          Importants ({totalImportant})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
