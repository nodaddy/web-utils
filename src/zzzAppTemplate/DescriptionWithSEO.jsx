const DescriptionWithSEO = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold"></h1>

      <p className="text-md text-gray-700"></p>

      <h2 className="text-2xl font-semibold"></h2>
      <ul className="list-disc pl-6 text-gray-700"></ul>

      <h2 className="text-2xl font-semibold"></h2>
      <ol className="list-decimal pl-6 text-gray-700"></ol>

      <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer"></summary>
          <p className="text-gray-700 mt-2"></p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer"></summary>
          <p className="text-gray-700 mt-2"></p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer"></summary>
          <p className="text-gray-700 mt-2"></p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer"></summary>
          <p className="text-gray-700 mt-2"></p>
        </details>
      </div>

      <h2 className="text-2xl font-semibold"></h2>
      <p className="text-gray-700"></p>
    </div>
  );
};

export default DescriptionWithSEO;
