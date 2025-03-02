"use client";
// pages/index.js
import { useEffect, useState } from "react";
import Head from "next/head";
import { useAppContext } from "../../Context/AppContext";
import { logGAEvent } from "../googleAnalytics/gaEvents";
import applicationNamesForGA from "../../Applications";

export default function Home() {
  // State for generator settings and results
  const [count, setCount] = useState(10);
  const [includeUser, setIncludeUser] = useState(true);
  const [includeBusiness, setIncludeBusiness] = useState(true);
  const [format, setFormat] = useState("json");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { setTool } = useAppContext();

  useEffect(() => {
    setTool("Sample Data Generator");
  }, []);

  // Generate user data
  function generateUser() {
    const genders = ["male", "female", "non-binary"];
    const gender = genders[Math.floor(Math.random() * genders.length)];

    const maleNames = [
      "James",
      "John",
      "Robert",
      "Michael",
      "William",
      "David",
      "Richard",
      "Joseph",
      "Thomas",
    ];
    const femaleNames = [
      "Mary",
      "Patricia",
      "Jennifer",
      "Linda",
      "Elizabeth",
      "Barbara",
      "Susan",
      "Jessica",
      "Sarah",
    ];
    const neutralNames = [
      "Alex",
      "Jordan",
      "Taylor",
      "Casey",
      "Riley",
      "Avery",
      "Quinn",
      "Morgan",
      "Skyler",
    ];

    let firstName;
    if (gender === "male")
      firstName = maleNames[Math.floor(Math.random() * maleNames.length)];
    else if (gender === "female")
      firstName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    else
      firstName = neutralNames[Math.floor(Math.random() * neutralNames.length)];

    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
    ];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const username = `${firstName.toLowerCase()}${Math.floor(
      Math.random() * 1000
    )}`;
    const domains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "example.com",
    ];
    const email = `${username}@${
      domains[Math.floor(Math.random() * domains.length)]
    }`;

    // Generate password with mixed characters
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Generate DOB for ages 18-65
    const now = new Date();
    const yearRange = 65 - 18;
    const birthYear =
      now.getFullYear() - 18 - Math.floor(Math.random() * yearRange);
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1; // Simplified to avoid month-specific day counts
    const dob = `${birthYear}-${birthMonth
      .toString()
      .padStart(2, "0")}-${birthDay.toString().padStart(2, "0")}`;

    const bios = [
      "Passionate about technology and innovation.",
      "Food enthusiast and travel blogger.",
      "Fitness coach and nutrition specialist.",
      "Artist and designer creating digital illustrations.",
      "Writer exploring themes of identity in society.",
    ];

    return {
      id: Math.floor(Math.random() * 10000),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      username,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: bios[Math.floor(Math.random() * bios.length)],
      gender,
      pronouns:
        gender === "male"
          ? "he/him"
          : gender === "female"
          ? "she/her"
          : "they/them",
      dateOfBirth: dob,
    };
  }

  // Generate business data
  function generateBusiness() {
    const companies = ["Tech", "Global", "Innovative", "Future", "Smart"];
    const suffixes = [
      "Solutions",
      "Systems",
      "Technologies",
      "Inc",
      "Dynamics",
    ];
    const companyName = `${
      companies[Math.floor(Math.random() * companies.length)]
    } ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;

    const industries = ["Tech", "Finance", "Healthcare", "Retail", "Education"];
    const industry = industries[Math.floor(Math.random() * industries.length)];

    const jobTitles = {
      Tech: [
        "Software Engineer",
        "Data Scientist",
        "Product Manager",
        "UX Designer",
      ],
      Finance: [
        "Financial Analyst",
        "Investment Banker",
        "Accountant",
        "Financial Advisor",
      ],
      Healthcare: [
        "Physician",
        "Nurse Practitioner",
        "Medical Director",
        "Healthcare Administrator",
      ],
      Retail: [
        "Store Manager",
        "Retail Associate",
        "Merchandiser",
        "Sales Representative",
      ],
      Education: ["Professor", "Teacher", "Principal", "Education Coordinator"],
    };

    const jobTitle =
      jobTitles[industry][
        Math.floor(Math.random() * jobTitles[industry].length)
      ];

    // Generate credit card
    let ccNumber = "4"; // Start with Visa prefix
    for (let i = 1; i < 16; i++) {
      ccNumber += Math.floor(Math.random() * 10);
    }
    ccNumber = `${ccNumber.substring(0, 4)} ${ccNumber.substring(
      4,
      8
    )} ${ccNumber.substring(8, 12)} ${ccNumber.substring(12, 16)}`;

    const currentYear = new Date().getFullYear() % 100;
    const expiryYear = currentYear + Math.floor(Math.random() * 5) + 1;
    const expiryMonth = Math.floor(Math.random() * 12) + 1;

    // Generate salary based on industry
    const baseSalaries = {
      Tech: 100000,
      Finance: 90000,
      Healthcare: 85000,
      Retail: 50000,
      Education: 60000,
    };

    const baseSalary = baseSalaries[industry];
    const variance = Math.random() * 30000 - 15000; // +/- 15k variance
    const salary = Math.round((baseSalary + variance) / 1000) * 1000; // Round to nearest thousand

    return {
      companyName,
      industry,
      jobTitle,
      department: ["Marketing", "Operations", "IT", "Sales", "R&D"][
        Math.floor(Math.random() * 5)
      ],
      creditCard: {
        number: ccNumber,
        expiryDate: `${expiryMonth.toString().padStart(2, "0")}/${expiryYear
          .toString()
          .padStart(2, "0")}`,
        cvv: Math.floor(Math.random() * 900) + 100,
      },
      bankAccount: {
        accountNumber: Math.floor(Math.random() * 9000000000) + 1000000000,
        routingNumber: Math.floor(Math.random() * 900000000) + 100000000,
        iban: `US${Math.floor(Math.random() * 90) + 10}${Array(20)
          .fill(0)
          .map(() => Math.floor(Math.random() * 10))
          .join("")}`,
      },
      salary: {
        amount: salary,
        currency: "USD",
        formatted: `$${salary.toLocaleString()}`,
      },
    };
  }

  // Generate the fake data
  function generateData() {
    setLoading(true);

    // Adding setTimeout to avoid UI freezing for large datasets
    setTimeout(() => {
      const results = [];

      for (let i = 0; i < count; i++) {
        const record = {};

        if (includeUser) {
          record.user = generateUser();
        }

        if (includeBusiness) {
          record.business = generateBusiness();
        }

        results.push(record);
      }

      setData(results);
      setShowResults(true);
      setLoading(false);
    }, 10);
  }

  // Export data as JSON
  function exportJSON() {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "fake_data.json";
    link.click();
  }

  // Export data as CSV
  function exportCSV() {
    // Flatten the nested objects for CSV format
    const flattenedData = data.map((item) => {
      const flattened = {};

      if (item.user) {
        Object.entries(item.user).forEach(([key, value]) => {
          flattened[`user_${key}`] = value;
        });
      }

      if (item.business) {
        Object.entries(item.business).forEach(([key, value]) => {
          if (typeof value === "object") {
            Object.entries(value).forEach(([subKey, subValue]) => {
              flattened[`business_${key}_${subKey}`] = subValue;
            });
          } else {
            flattened[`business_${key}`] = value;
          }
        });
      }

      return flattened;
    });

    // Get all unique keys
    const allKeys = new Set();
    flattenedData.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    // Convert to CSV
    const headers = Array.from(allKeys).join(",");
    const rows = flattenedData.map((item) => {
      return Array.from(allKeys)
        .map((key) => {
          const value = item[key] || "";
          // Escape commas and quotes in string values
          return typeof value === "string"
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(",");
    });

    const csvContent = `data:text/csv;charset=utf-8,${[headers, ...rows].join(
      "\n"
    )}`;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "fake_data.csv";
    link.click();
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Fake Data Generator</title>
        <meta
          name="description"
          content="Generate realistic fake data for testing and development"
        />
      </Head>

      <main className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Sample User Data Generator <span className="text-blue-500">⚡</span>
          </h1>

          {!showResults ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Data Configuration
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of records
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={count}
                    onChange={(e) =>
                      setCount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <input
                      id="user-data"
                      type="checkbox"
                      checked={includeUser}
                      onChange={(e) => setIncludeUser(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="user-data"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      <span className="font-medium">Include User Data</span> 👤
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="business-data"
                      type="checkbox"
                      checked={includeBusiness}
                      onChange={(e) => setIncludeBusiness(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="business-data"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      <span className="font-medium">
                        Include Business & Financial
                      </span>{" "}
                      🏢
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Export Format
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        id="format-json"
                        type="radio"
                        checked={format === "json"}
                        onChange={() => setFormat("json")}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="format-json"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        JSON
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="format-csv"
                        type="radio"
                        checked={format === "csv"}
                        onChange={() => setFormat("csv")}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="format-csv"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        CSV
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  logGAEvent(
                    applicationNamesForGA.sampleDataGenerator +
                      "_click_generate_data"
                  );
                  generateData();
                }}
                disabled={loading}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Data 🚀"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Generated Data{" "}
                  <span className="text-gray-500">({data.length} records)</span>
                </h2>
                <div className="space-x-2">
                  <button
                    onClick={format === "json" ? exportJSON : exportCSV}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Export as {format.toUpperCase()} 📥
                  </button>
                  <button
                    onClick={() => setShowResults(false)}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Generator ⚙️
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
              </div>

              {/* Data Preview Cards - showing first 2 records */}
              {data.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.slice(0, 2).map((record, index) => (
                    <div
                      key={index}
                      className="bg-white border rounded-lg overflow-hidden shadow"
                    >
                      <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-medium">Record #{index + 1}</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {record.user && (
                          <div>
                            <h4 className="font-medium text-sm text-gray-500 mb-1">
                              👤 User
                            </h4>
                            <div className="flex items-center mb-2">
                              <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                                <img
                                  src={record.user.avatar}
                                  alt="avatar"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {record.user.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{record.user.username}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm">
                              <div>
                                <span className="text-gray-500">Email:</span>{" "}
                                {record.user.email}
                              </div>
                              <div>
                                <span className="text-gray-500">DOB:</span>{" "}
                                {record.user.dateOfBirth}
                              </div>
                              <div>
                                <span className="text-gray-500">Gender:</span>{" "}
                                {record.user.gender} ({record.user.pronouns})
                              </div>
                            </div>
                          </div>
                        )}

                        {record.business && (
                          <div>
                            <h4 className="font-medium text-sm text-gray-500 mb-1">
                              🏢 Business
                            </h4>
                            <div className="text-sm">
                              <div>
                                <span className="text-gray-500">Company:</span>{" "}
                                {record.business.companyName}
                              </div>
                              <div>
                                <span className="text-gray-500">Job:</span>{" "}
                                {record.business.jobTitle},{" "}
                                {record.business.department}
                              </div>
                              <div>
                                <span className="text-gray-500">Salary:</span>{" "}
                                {record.business.salary.formatted}
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Credit Card:
                                </span>{" "}
                                {record.business.creditCard.number}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
