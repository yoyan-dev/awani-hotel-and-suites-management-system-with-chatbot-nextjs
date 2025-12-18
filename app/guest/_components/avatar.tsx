import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Popover,
  PopoverTrigger,
  PopoverContent,
  User,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { User as UserType } from "@/types/users";
import { LogOut } from "lucide-react";
// import { logout } from "@/lib/auth/index";

interface AvatarProps {
  user: UserType;
}

export const UserTwitterCard: React.FC<AvatarProps> = ({ user }) => {
  const [isFollowed, setIsFollowed] = React.useState(false);

  return (
    <Card className="max-w-[300px] border-none bg-transparent" shadow="none">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={user.user_metadata.image}
          />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user.user_metadata.full_name}
            </h4>
            <h5 className="text-small tracking-tight text-default-500">
              {user.email}
            </h5>
          </div>
        </div>
        {/* <Button
          className={
            isFollowed
              ? "bg-transparent text-foreground border-default-200"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button> */}
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo
          dignissimos accusamus atque deleniti pariatur eius qui quos voluptas
          ipsa nobis! Molestias maxime quo quos commodi, nemo earum enim ipsa
          ipsum?
          <span aria-label="confetti" role="img">
            🎉
          </span>
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <Listbox aria-label="Listbox menu with icons" variant="faded">
          <ListboxItem key="new">New file</ListboxItem>
          <ListboxItem key="copy">Copy link</ListboxItem>
          <ListboxItem key="edit" showDivider>
            Edit file
          </ListboxItem>
          <ListboxItem
            key="delete"
            className="text-waning"
            color="warning"
            startContent={<LogOut />}
          >
            Log out
          </ListboxItem>
        </Listbox>
      </CardFooter>
    </Card>
  );
};

export const AvatarPopover: React.FC<AvatarProps> = ({ user }) => {
  return (
    <Popover showArrow placement="bottom" className="cursor-pointer">
      <PopoverTrigger>
        <User
          as="button"
          avatarProps={{
            src:
              user.user_metadata.image ??
              "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
          className="transition-transform"
          description={user?.app_metadata?.roles?.[0] || "Guest"}
          name={user.user_metadata.full_name || "Guest User"}
        />
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <UserTwitterCard user={user} />
      </PopoverContent>
    </Popover>
  );
};
