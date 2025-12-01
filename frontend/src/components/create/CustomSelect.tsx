import React from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
  required?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  error = false,
  required = false,
}) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={`w-full min-w-[200px] px-4 py-3 border text-left focus:border-blue-500 focus:outline-none transition bg-white whitespace-nowrap ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 w-full min-w-max mt-1 bg-white border border-gray-300 max-h-60 overflow-auto focus:outline-none shadow-lg">
          {!value && (
            <Listbox.Option
              value=""
              className="cursor-pointer select-none relative py-3 pl-4 pr-10 text-gray-400 hover:bg-gray-100 whitespace-nowrap"
            >
              {placeholder}
            </Listbox.Option>
          )}
          {options.map((option) => (
            <Listbox.Option
              key={option}
              value={option}
              className={({ active }) =>
                `cursor-pointer select-none relative py-3 pl-4 pr-10 whitespace-nowrap min-w-[200px] ${
                  active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {option}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                      <Check className="w-5 h-5" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default CustomSelect;
