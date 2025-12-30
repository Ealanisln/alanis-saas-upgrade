"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Generic interface for payment/checkout objects
interface PaymentObject {
  id?: string;
  customer_details?: {
    name?: string;
  };
  payment_method_types?: string[];
  amount_total?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Moved outside to avoid recreation on each render
interface ParsedData {
  [key: string]: string;
}

function parseFieldData(data: string[]): ParsedData {
  const parsedData: ParsedData = {};
  data.forEach((field) => {
    const [key, value] = field.split(": ");
    const splitValues = value.split("_");
    const lastPart = splitValues[splitValues.length - 1];
    parsedData[key] = lastPart;
  });
  return parsedData;
}

function filterFields(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  fieldsToFilter: string[],
  prefix: string = "",
): string[] {
  const filteredFields: string[] = [];
  for (const key in obj) {
    const currentKey = `${prefix}${key}`;
    if (fieldsToFilter.includes(currentKey)) {
      const field = `${currentKey}: ${obj[key]}`;
      filteredFields.push(field);
    }
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const nestedFields = filterFields(
        obj[key],
        fieldsToFilter,
        `${prefix}${key}.`,
      );
      filteredFields.push(...nestedFields);
    }
  }
  return filteredFields;
}

const FIELDS_TO_FILTER = [
  "id",
  "customer_details.name",
  "payment_method_types.0",
  "amount_total",
];

export default function PrintObject({
  content,
}: {
  content: PaymentObject;
}): React.ReactElement {
  const parsedData = useMemo(() => {
    const formattedContent = JSON.stringify(content, null, 2);
    const filteredFields = filterFields(
      JSON.parse(formattedContent),
      FIELDS_TO_FILTER,
    );
    return parseFieldData(filteredFields);
  }, [content]);

  return (
    <Table>
      <TableCaption>A list of your recent purchase.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Field</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(parsedData).map((key, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{parsedData[key].slice(-12)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
