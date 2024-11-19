"use client";

import { CheckUserAndAdd } from "@/app/actions/page";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { ModeToggle } from "../toggleTheme/ModeToggle";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser(); // get user info
  const pathname = usePathname();

  // user database check
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      CheckUserAndAdd(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  if (pathname.startsWith("/sign")) return null;
  return (
    <nav className="w-full flex flex-col justify-between items-center m-auto py-4">
      <div className="w-full flex justify-between items-center gap-4 px-8">
        <div>
          <Link href="/">
            <h2 className="bg-indigo-600 text-white px-6 py-2 text-xl rounded-bl-full rounded-tr-full shadow-md">Budget</h2>
          </Link>
        </div>
        {isLoaded && isSignedIn ? (
          <>
            <div>
              <ul className="hidden md:flex justify-center items-center gap-8 ">
                <Link href="/budgets" className="hover:underline hover:underline-offset-8 decoration-2 transition">
                  <li>Mes budgets</li>
                </Link>
                <Link href="/" className="hover:underline hover:underline-offset-8 decoration-2 transition">
                  <li>Tableau De Board</li>
                </Link>
                <Link href="/transactions" className="hover:underline hover:underline-offset-8 decoration-2 transition">
                  <li>Mes transactions</li>
                </Link>
              </ul>
            </div>
            <div className="flex justify-center items-center gap-4">
              <ModeToggle />
              <UserButton />
            </div>
          </>
        ) : (
          <div className="hidden md:flex justify-center items-center gap-8">
            <Link href={"/sign-in"}>
              <button className="bg-quaternary hover:bg-quaternary/80 h-12 w-44 rounded-full shadow-md hover:duration-300 hover:ease-in-out active:scale-95">se connecter</button>
            </Link>
            <Link href={"/sign-up"}>
              <button className="bg-primary hover:bg-primary/80 h-12 w-44 rounded-full shadow-md hover:duration-300 hover:ease-in-out  active:scale-95">s'inscrire</button>
            </Link>
          </div>
        )}
      </div>{" "}
      {isLoaded && isSignedIn ? (
        <>
          <div>
            <ul className="flex md:hidden justify-center items-center gap-6 py-16 flex-wrap mx-2">
              <Link href="/budgets" className="hover:underline hover:underline-offset-8 decoration-2 transition">
                <li>Mes budgets</li>
              </Link>
              <Link href="/" className="hover:underline hover:underline-offset-8 decoration-2 transition">
                <li>Tableau De Board</li>
              </Link>
              <Link href="/" className="hover:underline hover:underline-offset-8 decoration-2 transition">
                <li>Mes transactions</li>
              </Link>
            </ul>
          </div>
        </>
      ) : (
        <div className="flex md:hidden justify-center items-center gap-6 py-16 mx-2 flex-wrap">
          <Link href={"/sign-in"}>
            <button className="bg-tertiary hover:bg-secondary h-12 w-44 rounded-full duration-300 ease-in-out">se connecter</button>
          </Link>
          <Link href={"/sign-up"}>
            <button className="bg-primary hover:bg-primary/50 h-12 w-44 rounded-full duration-300 ease-in-out">s'inscrire</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
