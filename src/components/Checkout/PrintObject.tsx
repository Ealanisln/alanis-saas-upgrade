"use client";

import { useState } from "react";
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

export default function PrintObject({
  content,
}: {
  content: PaymentObject;
}): React.ReactElement {
  const formattedContent: string = JSON.stringify(content, null, 2);
  const [_loggedFields, _setLoggedFields] = useState<string[]>([]);

  function filterFields(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: any,
    fieldsToFilter: string[],
    prefix: string = "",
  ) {
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

  const fieldsToFilter = [
    "id",
    "customer_details.name",
    "payment_method_types.0",
    "amount_total",
  ];

  const filterField = filterFields(
    JSON.parse(formattedContent),
    fieldsToFilter,
  );

  const TableComponent: React.FC<{ data: string[] }> = ({ data }) => {
    const parsedData: { [key: string]: string } = {};

    data.forEach((field) => {
      const [key, value] = field.split(": ");
      const splitValues = value.split("_");
      const lastPart = splitValues[splitValues.length - 1];
      parsedData[key] = lastPart;
    });

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
  };

  return <TableComponent data={filterField} />;
}
