import React from "react";
import { Box, Link, Typography } from "@material-ui/core";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { ExportToCsv } from "export-to-csv";
import { IParsedRequest } from "request-shared";

const CsvExport = ({ requests }: { requests?: IParsedRequest[] }) => {
  const onClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    if (requests) {
      const csv = new ExportToCsv({
        filename: "requests",
        useKeysAsHeaders: true,
      });
      csv.generateCsv(
        requests.map(({ raw, currency, loaded, network, ...request }) => {
          return Object.keys(request).reduce((obj, field) => {
            obj[field] = (request as any)[field] || "";
            return obj;
          }, {} as any);
        })
      );
    }
  };

  return requests && requests.length > 0 ? (
    <Link
      color="inherit"
      style={{ display: "flex" }}
      href="#"
      onClick={onClick}
    >
      <ArrowDownward />
      <Box width={8} />
      <Typography variant="h4">Export to CSV</Typography>
    </Link>
  ) : (
    <div />
  );
};

export default CsvExport;
