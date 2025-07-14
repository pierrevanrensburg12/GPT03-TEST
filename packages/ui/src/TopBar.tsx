import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export interface TopBarProps {
  tenantLogo?: string;
  avatar?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ tenantLogo, avatar }) => {
  return (
    <div className="flex items-center justify-between bg-surface p-4 shadow-md">
      <div className="flex items-center">
        <img
          src={tenantLogo || "/logo.png"}
          alt="tenant logo"
          className="h-8"
        />
      </div>
      <div className="text-primary-500 font-bold">QuickLaunch-Ads</div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="focus:outline-none">
            <img
              src={avatar || "/avatar.png"}
              alt="avatar"
              className="h-8 w-8 rounded-full"
            />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="rounded-md bg-white shadow-md">
          <DropdownMenu.Item className="px-3 py-2">Profile</DropdownMenu.Item>
          <DropdownMenu.Item className="px-3 py-2">Sign out</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export default TopBar;
