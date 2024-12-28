import * as AvatarPrimitive from "@radix-ui/react-avatar";

export const Avatar: React.FC = () => {
  return (
    <div>
      <AvatarPrimitive.Root className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
        <AvatarPrimitive.Image
          className="size-full rounded-[inherit] object-cover"
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarPrimitive.Fallback
          className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
          delayMs={600}
        >
          CT
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    </div>
  );
};
