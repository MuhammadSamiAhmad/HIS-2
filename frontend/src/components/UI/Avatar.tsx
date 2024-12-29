import * as AvatarPrimitive from "@radix-ui/react-avatar";

interface AvatarProps {
  profileImage: string; // URL of the profile image
  username: string; // Full name of the user
}

export const Avatar = ({ profileImage, username }: AvatarProps) => {
  const getInitials = (name: string): string => {
    return name
      .split(" ") // Split name into words
      .map((word) => word.charAt(0).toUpperCase()) // Take the first letter of each word and capitalize
      .join(""); // Join the initials into a single string
  };

  return (
    <div>
      <AvatarPrimitive.Root className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
        <AvatarPrimitive.Image
          className="size-full rounded-[inherit] object-cover"
          src={profileImage}
          alt={username}
        />
        <AvatarPrimitive.Fallback
          className="leading-1 flex size-full items-center justify-center bg-Silver-2 text-[15px] font-medium text-violet11"
          delayMs={600}
        >
          {getInitials(username)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    </div>
  );
};
