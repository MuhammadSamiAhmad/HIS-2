import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

interface ScrollAreaProps {
  children: React.ReactNode;
}

export default function ScrollArea({ children }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className="w-full overflow-hidden">
      <ScrollAreaPrimitive.Viewport className="w-full h-full">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="w-2 bg-gray-200"
      >
        <ScrollAreaPrimitive.Thumb className="bg-gray-400 rounded-full" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
}
