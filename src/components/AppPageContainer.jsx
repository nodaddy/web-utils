export const AppPageContainer = ({ children }) => {
  return (
    <div className="flex flex-col justify-between w-full md:flex-row overflow-scroll pt-28 bg-gradient-to-br text-gray-700 from-blue-50 to-indigo-100 overflow:auto md:px-6">
      {children}
    </div>
  );
};
