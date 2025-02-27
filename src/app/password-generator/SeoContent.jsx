const SeoContent = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 pt-32">
      <h1 className="text-3xl font-bold text-center">
        Free Password Generator - Create Strong & Secure Passwords
      </h1>
      <p className="text-lg text-gray-700">
        Use the <strong>random password generator</strong> to create secure and
        strong passwords instantly. Protect your online accounts with a{" "}
        <strong>free password creator</strong> that ensures high security
        against hacking attempts.
      </p>

      <h2 className="text-2xl font-semibold">
        Why Use Our Secure Password Generator?
      </h2>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Instantly generate strong, unique passwords.</li>
        <li>Avoid weak passwords that hackers can easily crack.</li>
        <li>
          Customizable options: length, numbers, symbols, uppercase, lowercase.
        </li>
        <li>Completely free and easy to use.</li>
      </ul>

      <h2 className="text-2xl font-semibold">
        How to Use the Password Generator?
      </h2>
      <ol className="list-decimal pl-6 text-gray-700">
        <li>Click the "Generate Password" button.</li>
        <li>Customize length and characters if needed.</li>
        <li>Copy and use your secure password.</li>
      </ol>

      <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer">
            Is this password generator free?
          </summary>
          <p className="text-gray-700 mt-2">
            Yes! Our <strong>free password creator</strong> is available for
            everyone without any cost.
          </p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer">
            How secure are the generated passwords?
          </summary>
          <p className="text-gray-700 mt-2">
            Our <strong>secure password generator</strong> creates random
            passwords that are highly resistant to brute-force attacks.
          </p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer">
            Can I customize my password?
          </summary>
          <p className="text-gray-700 mt-2">
            Yes! You can adjust length, symbols, numbers, and
            uppercase/lowercase settings.
          </p>
        </details>

        <details className="border border-gray-300 p-4 rounded-lg">
          <summary className="font-medium cursor-pointer">
            Do you store generated passwords?
          </summary>
          <p className="text-gray-700 mt-2">
            No, we do not store any passwords. They are generated locally in
            your browser.
          </p>
        </details>
      </div>

      <h2 className="text-2xl font-semibold">
        Why You Need a Strong Password?
      </h2>
      <p className="text-gray-700">
        Using a <strong>random password generator</strong> ensures your online
        security. Weak passwords can be easily guessed or cracked by hackers. A
        strong password includes a mix of uppercase letters, lowercase letters,
        numbers, and symbols.
      </p>
    </div>
  );
};

export default SeoContent;
