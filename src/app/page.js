import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full bg-black flex flex-col column items-center justify-around min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* {heading h1 with large text} */}
      <br />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <header className="row-start-1 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold">NEXONWARE</h1>
        </header>
        <div className="list-inside list-decimal text-xl text-center sm:text-left]">
          Simplifying Your Digital Life
        </div>
        <br />
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="text-black rounded border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-7 sm:h-9 px-4 sm:px-5"
            href=""
            rel="noopener noreferrer"
          >
            Explore
          </a>
          <a
            className="rounded transition-colors flex items-center justify-center text-sm sm:text-base h-7 sm:h-9 px-4 sm:px-5 "
            href=""
            rel="noopener noreferrer"
          >
            Blog
          </a>
        </div>
        <br />
        <br />
        <br />
        <br />
      </main>
      <footer className="row-start-3 pr-20 flex gap-6 flex-wrap items-center justify-end w-full">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          About Us
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Privacy Policy
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Join our team
        </a>
      </footer>
    </div>
  );
}
