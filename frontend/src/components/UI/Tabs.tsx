import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useState } from "react";
import { TabsProps } from "../../types/dataGridTypes";

export default function Tabs({ tabs }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]?.value || "");

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <TabsPrimitive.Root value={selectedTab} onValueChange={handleTabChange}>
      <div id="tab-heading" className="absolute -top-11">
        <TabsPrimitive.List className="flex flex-row gap-10">
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={`py-2 px-4 ${
                selectedTab === tab.value
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </div>
      <div className="pt-3">
        {tabs.map((tab) => (
          <TabsPrimitive.Content key={tab.value} value={tab.value}>
            {tab.content}
          </TabsPrimitive.Content>
        ))}
      </div>
    </TabsPrimitive.Root>
  );
}
