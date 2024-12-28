import { ResponsiveBar } from "@nivo/bar";
import ScrollArea from "../../components/UI/ScrollArea";
import { mockBarData as data } from "../../utils/mockAdminDashboard";
import Image from "../../assets/images/Me.png";
import { MOCK_TABLE_DATA } from "../../utils/mockTable";
import { StatCard } from "../../components/UI/StatCard";
import {
  UserCheck,
  HeartPulse,
  BookHeart,
  BriefcaseMedical,
} from "lucide-react";

const DentalDashboard = () => {
  const stats = [
    {
      title: "Patient Check-ups Completed",
      value: "12,361",
      icon: <UserCheck size={50} />,
    },
    {
      title: "Dental Surgeries Completed",
      value: "431,225",
      icon: <HeartPulse size={50} />,
    },
    {
      title: "Clinic Total Patients",
      value: "32,441",
      icon: <BookHeart size={50} />,
    },
    {
      title: "Clinic Total Dentists",
      value: "1,325,134",
      icon: <BriefcaseMedical size={50} />,
    },
  ];

  return (
    <ScrollArea>
      <div className="bg-background p-6 h-[740px] font-manrope">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              title={stat.title}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="rounded-lg bg-background border-2 border-Silver-3 shadow-2xl text-textColor h-[500px]">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-bold">
                      Doctors Revenue Percentage
                    </h2>
                    <p className="text-3xl font-bold text-gray-400">
                      $59,342.32
                    </p>
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveBar
                    data={data}
                    keys={[
                      "Plaque Removal",
                      "Tooth Whitening",
                      "Fluoride Treatment",
                      "X-Rays",
                      "Composite Fillings",
                      "Amalgam Fillings",
                      "Gold Fillings",
                      "Ceramic Fillings",
                      "Braces",
                      "Invisalign",
                      "Retainers",
                      "Space Maintainers",
                      "Gum Surgery",
                      "Jaw Surgery",
                      "Implant Surgery",
                      "Bone Grafting",
                      "Simple Extraction",
                      "Surgical Extraction",
                      "Wisdom Tooth Removal",
                      "Root Canal Treatment",
                      "Dentures",
                      "Dental Crowns",
                      "Dental Bridges",
                    ]}
                    indexBy="operation"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={{ scheme: "nivo" }}
                    defs={[
                      {
                        id: "dots",
                        type: "patternDots",
                        background: "inherit",
                        color: "#38bcb2",
                        size: 4,
                        padding: 1,
                        stagger: true,
                      },
                      {
                        id: "lines",
                        type: "patternLines",
                        background: "inherit",
                        color: "#eed312",
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10,
                      },
                    ]}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 1.6]],
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "operation",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "frequency",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    enableLabel={false}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: "color",
                      modifiers: [["darker", 1.6]],
                    }}
                    legends={[
                      {
                        dataFrom: "keys",
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: "left-to-right",
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                          {
                            on: "hover",
                            style: {
                              itemOpacity: 1,
                            },
                          },
                        ],
                      },
                    ]}
                    role="application"
                    barAriaLabel={function (e) {
                      return (
                        e.id +
                        ": " +
                        e.formattedValue +
                        " in operation: " +
                        e.indexValue
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="flex flex-col rounded-lg bg-background border-2 border-Silver-3 shadow-2xl text-textColor h-[500px]">
              <ScrollArea>
                <div id="table" className="h-[480px]">
                  <table className="w-full min-w-full divide-y divide-gray-200">
                    <thead className="bg-Silver-2 rounded-t-lg">
                      <tr>
                        <th className="px-5 py-3 text-left font-bold text-textColor">
                          Doctor
                        </th>
                        <th className="px-5 py-3 text-left font-bold text-textColor">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {MOCK_TABLE_DATA.adminDoctors.map((doctor) => (
                        <tr key={doctor.id} className="hover:bg-gray-50">
                          {/* Doctor Column */}
                          <td className="px-4 py-3 text-sm font-medium flex items-center">
                            <img
                              src={Image}
                              alt={doctor.doctorName}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <span>{doctor.doctorName}</span>
                          </td>
                          {/* Status Column */}
                          <td className="px-4 py-3 text-sm font-medium">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                                doctor.status === "Available"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {doctor.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DentalDashboard;
