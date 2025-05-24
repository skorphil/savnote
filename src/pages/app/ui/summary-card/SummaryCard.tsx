import styles from "./SummaryCard.module.css";
import numeral from "numeral";
import { Card, Table, TableBody, TableCell, TableRow } from "konsta/react";
import { unixToHumanReadable } from "@/shared/lib/date-time-format";
import { useSummaryData } from "./useSummaryData";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

/**
 * Component displaying summary of savings
 */
function SummaryCard() {
  const summaryData = useSummaryData();

  return (
    <Card
      className="block overflow-x-auto mt-2"
      contentWrap={false}
      header="Summary"
    >
      <Table>
        <TableBody>
          {summaryData.map((record, id, array) => {
            // const row = Object.values(record);
            return (
              <TableRow key={id}>
                <TableCell className={`${styles.tableCell} !px-4`}>
                  {unixToHumanReadable(Number(record.date))}
                </TableCell>
                <TableCell>{numeral(record.total).format("0.00a")}</TableCell>
                <TableCell className="!px-4">
                  {array[id + 1]?.total ? (
                    record.total - array[id + 1]?.total > 0 ? (
                      <div className="flex flex-row items-center">
                        <MdArrowDropUp size={24} className="text-green-400" />
                        <p>
                          {numeral(record.total - array[id + 1]?.total).format(
                            "0.00a"
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center">
                        <MdArrowDropDown size={24} className="text-red-400" />
                        <p>
                          {numeral(record.total - array[id + 1]?.total).format(
                            "0.00a"
                          )}
                        </p>
                      </div>
                    )
                  ) : null}
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
