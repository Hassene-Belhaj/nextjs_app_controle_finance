import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full px-8 h-20">
      <div className="w-full h-full border-t-[1px] flex justify-between items-center gap-8 ">
        <span>
          <h2 className="bg-indigo-600 text-white text-[10px] px-4 py-2 rounded-bl-full rounded-tr-full shadow-lg shadow-indigo-600/40">Budget</h2>
        </span>

        <span>
          <p className="text-sm text-muted-foreground">Powered By Budget @ {new Date().getFullYear()}</p>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
