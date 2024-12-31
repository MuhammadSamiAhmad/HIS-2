import HL7Accordion from "../components/UI/Accordion";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollArea from "../components/UI/ScrollArea";

// Define types for HL7 message and API response
type HL7Message = {
  type: string;
  data: Record<string, unknown>;
};

type HL7ApiResponse = Record<string, unknown[]>; // Define keys as message types and values as arrays of message objects

export default function HL7Display() {
  const [hl7Messages, setHl7Messages] = useState<HL7Message[]>([]);

  // Fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get<HL7ApiResponse>("/hl7_messages.json"); // Replace with your JSON API endpoint
      const data = response.data;

      // Transform messages into a flat array
      const transformedMessages: HL7Message[] = Object.entries(data).flatMap(
        ([type, messages]) =>
          (messages as Record<string, unknown>[]).map((message) => ({
            type,
            data: message,
          }))
      );

      setHl7Messages(transformedMessages);
    } catch (error) {
      console.error("Error fetching HL7 messages:", error);
    }
  };

  // Fetch messages on component mount and periodically
  useEffect(() => {
    fetchMessages();

    // Optionally poll every X seconds
    const interval = setInterval(fetchMessages, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start justify-center w-full mx-auto h-[700px] mt-2">
      <ScrollArea>
        <HL7Accordion messages={hl7Messages} />
      </ScrollArea>
    </div>
  );
}
