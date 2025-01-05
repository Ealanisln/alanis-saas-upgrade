"use client";

import type { Stripe } from "stripe";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function PrintObject({
  content,
}: {
  content: Stripe.PaymentIntent | Stripe.Checkout.Session;
}): React.ReactElement {
  const formattedContent: string = JSON.stringify(content, null, 2);
  const [loggedFields, setLoggedFields] = useState<string[]>([]);

  function filterFields(
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