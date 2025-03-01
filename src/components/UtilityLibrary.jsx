import { allUtilities } from "../Applications";
// pages/index.js
import Link from "next/link";

export default function UtilityLibrary() {
  const utils = [];

  Object.entries(allUtilities).forEach(([category, items]) => {
    utils.push(...items.map((item) => ({ ...item, category })));
  });

  return (
    <div id="util-lib" className="flex flex-col">
      <main className="flex-grow pt-10 pb-16">
        <div className="container mx-auto px-4">
          <section id="utilities" className="rounded-lg ">
            <div className="flex items-center text-gray-600 justify-between mb-6 ">
              <h2 className="text-2xl font-bold">
                🚀 &nbsp;Explore Our Web Utilities
              </h2>
              <Link
                href="/"
                className="text-gray-600 text-black-800 hover:text-blue-800 text-md"
              >
                🔍&nbsp; Search &nbsp;&nbsp;&nbsp;&nbsp;
              </Link>
            </div>
            {/* Display utilities */}
            <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-1 mt-11">
              {utils.length > 0 ? (
                utils.map((util) => (
                  <div key={util.id} className="py-1 my-2">
                    <Link
                      href={`/${util.id}`}
                      target="_blank"
                      className="flex items-end group gap-1"
                    >
                      {/* Utility icon */}
                      <div className="mr-1.5 text-2xl text-gray-400 border bg-gray-200 px-2 py-1 rounded-lg">
                        {util.icon}
                      </div>

                      {/* Utility title and description */}
                      <div style={{ lineHeight: "1rem" }}>
                        <h3 className="text-gray-800 font-lg group-hover:text-blue-600 transition-colors">
                          {util.title}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {util.description}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-500">
                  No utilities found matching your search. Try different
                  keywords or filters.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
