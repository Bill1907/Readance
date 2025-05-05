import React from "react";

const Footer: React.FC = () => (
  <footer className="py-3 px-5 text-center border-t border-slate-200 text-xs text-slate-500 bg-white">
    Readance © {new Date().getFullYear()} - Enhance your reading experience
  </footer>
);

export default Footer;
