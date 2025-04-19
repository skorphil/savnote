import styles from "./SummaryCard.module.css";
import numeral from "numeral";
import { Card, Table, TableBody, TableCell, TableRow } from "konsta/react";
import { unixToHumanReadable } from "@/shared/lib/date-time-format";
import { useSummaryData } from "./useSummaryData";

/**
 * Component displaying summary of savings
 */
function SummaryCard() {
  const summaryData = useSummaryData();

  return (
    <Card className="block overflow-x-auto mt-8" contentWrap={false}>
      Summary
      <Table>
        <TableBody>
          {summaryData?.map((record, id, array) => {
            // const row = Object.values(record);
            return (
              <TableRow>
                <TableCell className={styles.tableCell}>
                  {unixToHumanReadable(Number(record.date))}
                </TableCell>
                <TableCell>{numeral(record.total).format("0.00a")}</TableCell>
                <TableCell>
                  {array[id + 1]?.total
                    ? numeral(record.total - array[id + 1]?.total).format(
                        "0.00a"
                      )
                    : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

export { SummaryCard };
