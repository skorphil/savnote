import { Journal } from "@/entities/journal";
import {
  journalStore,
  journalStoreQueries,
} from "@/entities/journal/model/JournalStore";
import { Card, Table, TableBody, TableCell, TableRow } from "konsta/react";

/**
 * Component displaying summary of savings
 */
function SummaryCard() {
  const journal = Journal.instance;
  const recordDates = journal?.useJournalSliceIds("InstitutionsByDate");

  const result = recordDates?.map((date) => {
    journalStoreQueries.setQueryDefinition(
      date,
      "assets",
      ({ select, where }) => {
        select("date");
        select("amount");
        select("currency");
        where("date", Number(date));
      }
    );
    let totalInCounterCurrency = 0;
    journalStoreQueries.forEachResultRow(date, (rowId) => {
      const { amount, currency: baseCurrency } = journalStore.getRow(
        "assets",
        rowId
      );
      const { rate } = journalStore.getRow(
        "quotes",
        `${date}.${baseCurrency}.usd`
      );
      if (
        amount === undefined ||
        baseCurrency === undefined ||
        rate === undefined
      )
        throw Error("Cant find currencies information");
      const amountInCounterCurrency = amount * rate;
      totalInCounterCurrency += amountInCounterCurrency;
    });
    journalStoreQueries.delQueryDefinition(date);
    return { total: totalInCounterCurrency, date };
  });

  return (
    <>
      <Card className="block overflow-x-auto mt-8" contentWrap={false}>
        Summary
        <Table>
          <TableBody>
            {result?.map((record, id, array) => {
              // const row = Object.values(record);
              return (
                <TableRow>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.total}</TableCell>
                  <TableCell>
                    {array[id + 1]?.total
                      ? record.total - array[id + 1]?.total
                      : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

export { SummaryCard };
