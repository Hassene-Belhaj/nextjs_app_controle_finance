"use client";

import { CheckUserAndAdd } from "@/app/actions/page";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "../toggleTheme/ModeToggle";
import { usePathname } from "next/navigation";
import MenuButton from "@/utils/MenuButton";
import { LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser(); // get user info
  const [active, setActive] = useState<boolean>(false);
  const [navBar, setNavBar] = useState<boolean>(false);
  const pathname = usePathname();

  // user database check
  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      CheckUserAndAdd(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  if (pathname?.startsWith("/sign")) return null;

  const Links = [
    { pathname: "/budgets", name: "Mes Budgets" },
    { pathname: "/transactions", name: "Mes Transactions" },
    { pathname: "/dashboard", name: "Tableau De Board" },
  ];

  const onClickDelay = () => {
    setActive(!active);
  };

  useEffect(() => {
    const handler = () => {
      if (window.scrollY > 80) {
        setNavBar(true);
      } else {
        setNavBar(false);
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  });

  return (
    <nav className={`fixed top-0 left-0 w-full h-20 md:h-20 bg-background m-auto z-50 ${navBar ? "border-2 shadow-lg" : null}`}>
      <div className="max-w-[1920px] h-full bg-background flex justify-between m-auto items-center gap-4 px-4 md:px-8 relative z-50">
        <div>
          <Link href="/">
            <h2 className="bg-indigo-600 text-white text-sm px-6 py-2 md:text-xl rounded-bl-full rounded-tr-full shadow-lg shadow-indigo-600/40">Budget</h2>
          </Link>
        </div>
        {isLoaded && isSignedIn ? (
          <>
            <div className="hidden md:flex">
              <ul className="flex justify-center items-center gap-8">
                {Links.map((L: any, i: number) => {
                  return (
                    <Link key={i} href={L.pathname} onClick={onClickDelay} className={`hover:underline hover:underline-offset-8 decoration-2`}>
                      <li>{L.name}</li>
                    </Link>
                  );
                })}
              </ul>
            </div>
            <div className="flex justify-center items-center gap-4">
              <UserButton />
              <ModeToggle />
              <span className="w-auto flex md:hidden justify-center items-center">
                <MenuButton active={active} setActive={setActive} />
              </span>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center gap-8">
            <div className="hidden md:flex  justify-center items-center gap-4">
              <Link href={"/sign-in"}>
                <button className="bg-transparent dark:bg-primary text-indigo-600 border-2 dark:text-secondary dark:border-primary border-indigo-600  h-12 w-44 rounded-full  duration-300 ease-in-out">se connecter</button>
              </Link>
              <Link href={"/sign-up"}>
                <button className="bg-indigo-600 text-white h-12 w-44 rounded-full duration-300 ease-in-out">s'inscrire</button>
              </Link>
            </div>
            <ModeToggle />
            <span className="w-auto flex md:hidden justify-center items-center">
              <MenuButton active={active} setActive={setActive} />
            </span>
          </div>
        )}
      </div>
      <div className={`${active ? "left-0" : "-left-[100%]"} block md:hidden fixed top-0  w-full h-full bg-gray-200 duration-300 ease-linear text-2xl text-indigo-600`}>
        <div className="w-full h-full flex justify-center items-center">
          {isLoaded && isSignedIn ? (
            <>
              <div className="flex md:hidden">
                <ul className="flex flex-col justify-center items-center gap-8">
                  {Links.map((L: any, i: number) => {
                    return (
                      <Link key={i} href={L.pathname} onClick={onClickDelay} className={`hover:underline hover:underline-offset-8 decoration-2`}>
                        <li>{L.name}</li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center gap-8">
              <div className="flex md:hidden flex-col justify-center items-center gap-4">
                <Link href={"/sign-in"}>
                  <button className="w-full px-4 py-4 flex justify-center items-center gap-4 hover:underline hover:underline-offset-8 decoration-2">
                    <LogIn />
                    Se connecter
                  </button>
                </Link>
                <Link href={"/sign-up"}>
                  <button className="w-full px-4 py-4 flex justify-center items-center gap-4 hover:underline hover:underline-offset-8 decoration-2">
                    <UserPlus />
                    S'enregister
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
