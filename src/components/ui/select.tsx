import { FC, ReactNode } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export const Select: FC<SelectProps> = ({ children, ...props }) => {
  return (
    <select {...props} className="w-full p-2 border rounded">
      {children}
    </select>
  );
};
