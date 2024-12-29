import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

// Types for the structured HL7 data
interface HL7MessageData {
  type: string; // Message Type (e.g., ADT^A04, SCH^S12)
  //Record<Keys, Values>
  data: Record<string, string | number | null | undefined>; // Allow undefined for optional fields
}

interface HL7AccordionProps {
  messages: HL7MessageData[];
}

// HL7Accordion Component
const HL7Accordion: React.FC<HL7AccordionProps> = ({ messages }) => (
  <Accordion.Root
    className="w-full max-w-2xl rounded-md bg-mauve6 shadow-md"
    type="single"
    defaultValue={messages[0]?.type || ""}
    collapsible
  >
    {messages.map((message) => (
      <AccordionItem key={message.type} value={message.type}>
        <AccordionTrigger>{message.type}</AccordionTrigger>
        <AccordionContent>
          <MessageDetails data={message.data} />
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion.Root>
);

// Message Details Component
const MessageDetails: React.FC<{
  data: Record<string, string | number | null | undefined>;
}> = ({ data }) => (
  <div className="p-3 bg-gray-100 rounded-md text-sm">
    {Object.entries(data).map(([key, value]) => (
      <div key={key} className="mb-2">
        <span className="font-semibold">{key}:</span> {value || "N/A"}
      </div>
    ))}
  </div>
);

// Accordion Subcomponents
const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ children, ...props }, forwardedRef) => (
  <Accordion.Item
    className="mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] focus-within:shadow-mauve12"
    {...props}
    ref={forwardedRef}
  >
    {children}
  </Accordion.Item>
));

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, ...props }, forwardedRef) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      className="group flex h-[45px] flex-1 cursor-pointer items-center justify-between bg-white px-5 text-[15px] leading-none text-violet11 shadow-[0_1px_0] shadow-mauve6 outline-none hover:bg-mauve2"
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        className="text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
        aria-hidden
      />
    </Accordion.Trigger>
  </Accordion.Header>
));

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, ...props }, forwardedRef) => (
  <Accordion.Content
    className="overflow-hidden bg-mauve2 text-[15px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown"
    {...props}
    ref={forwardedRef}
  >
    <div className="px-5 py-[15px]">{children}</div>
  </Accordion.Content>
));

export default HL7Accordion;
