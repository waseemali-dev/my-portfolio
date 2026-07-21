
import React from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  text: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  style: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function Button({ text, href, type = "button", style, className = "", onClick, icon = <ArrowRight size={16} /> }: ButtonProps) {
  const Component = href ? "a" : "button";
  
  return (
    <Component 
      href={href} 
      type={href ? undefined : type} 
      onClick={onClick}
      className={`btn btn-${style} ${className}`}
    >
      <span className="btn-text">{text}</span>
      <span className="btn-icon">
        {icon}
      </span>
    </Component>
  );
}
