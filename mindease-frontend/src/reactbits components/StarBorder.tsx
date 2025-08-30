import React from "react";
import "./StarBorder.css";

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    className?: string;
    children?: React.ReactNode;
    color?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
    contentClassName?: string;
    contentStyle?: React.CSSProperties;
    delay?: React.CSSProperties['animationDelay'];
  }

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  contentClassName,
  contentStyle,
  delay = "0s",
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || "button";

  return (
    <Component 
      className={`star-border-container ${className}`} 
      {...(rest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as any).style,
      }}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDuration: speed,
          animationDelay: delay,
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDuration: speed,
          animationDelay: delay,
        }}
      ></div>
      <div className={contentClassName ?? "inner-content"} style={contentStyle}>{children}</div>
    </Component>
  );
};

export default StarBorder;
