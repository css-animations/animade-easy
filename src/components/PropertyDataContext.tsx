import { PropertyData } from "../types/propertyData";
import {
  propertyReducer,
  PropertyReducerActions,
  propertyReducerDefaultState,
} from "../utils/propertyDataReducer";
import React, { useReducer } from "react";

interface PropertyDataContextType {
  propertyData: PropertyData;
  dispatchPropertyData: React.Dispatch<PropertyReducerActions>;
}

const defaultPropertyContext: PropertyDataContextType = {
  propertyData: propertyReducerDefaultState,
  dispatchPropertyData: () => {},
};

export const PropertyDataContext = React.createContext(defaultPropertyContext);

interface PropertyDataProps {
  children: JSX.Element;
}

export function PropertyDataProvider(props: PropertyDataProps) {
  const [propertyData, dispatchPropertyData] = useReducer(
    propertyReducer,
    propertyReducerDefaultState,
  );

  return (
    <PropertyDataContext.Provider
      value={{ propertyData, dispatchPropertyData }}
    >
      {props.children}
    </PropertyDataContext.Provider>
  );
}
