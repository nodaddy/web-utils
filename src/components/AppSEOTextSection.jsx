export const AppSEOTextSection = ({ children }) => {
  return (
    <div
      style={
        {
          // display: "none" // for enterprise
        }
      }
      className="w-full h-[10vh] px-6 text-gray-600 mb-6 overflow-scroll md:w-[40vw] md:pr-0 md:h-auto "
    >
      {children}
    </div>
  );
};
