import styles from "./SearchDialog.module.css";
import { Link, List, ListInput, ListItem, Radio } from "konsta/react";
import Fuse from "fuse.js";
import { type ChangeEvent, type ReactElement, useState } from "react";

type SearchDialogProps = {
  data: readonly Record<string, unknown>[];
  onOptionSelect: (value: string | number) => unknown;
  onClose: () => void;
  outline?: boolean;
  label?: string;
  value: string | number;
};

const fuseOptions = {
  keys: ["en"],
};

export function SearchDialog(props: SearchDialogProps) {
  const { data, onClose, onOptionSelect, outline, label, value } = props;
  const [query, setQuery] = useState<string>("");
  const fuse = new Fuse(data, fuseOptions);

  const filteredData = fuse.search(query);

  let itemList: ReactElement[] = [];

  if (query.length > 0)
    itemList = filteredData.map((country) => (
      <Item
        onClick={() => onOptionSelect(country.item.alpha2 as string)}
        title={country.item.en as string}
        checked={country.item.alpha2 === value}
      />
    ));

  if (query.length === 0) {
    itemList = data.map((country) => (
      <Item
        onClick={() => onOptionSelect(country.alpha2 as string)}
        title={country.en as string}
        checked={country.alpha2 === value}
      />
    ));
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={`${styles.popup} flex flex-col text-inherit`}>
        <div className={`relative hairline-b ${styles.header}`}>
          <div
            className={`ml-4 mr-4 items-center gap-4 flex flex-row h-[56px]`}
          >
            <h2 className=" text-lg">{label}</h2>
          </div>

          <ListInput
            value={query}
            autoFocus
            outline={outline}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />
        </div>

        <List className="mx-2 !py0 mt-4 mb-0 h-full overflow-y-scroll">
          {itemList}
        </List>
        <div className="h-[56px] flex-shrink-0 items-center flex justify-end px-[24px] relative hairline-t">
          <Link onClick={onClose}>Cancel</Link>
        </div>
      </div>
    </>
  );
}

type ItemProps = {
  title?: string;
  subtitle?: string;
  checked?: boolean;
  onClick: () => unknown;
};

function Item(props: ItemProps) {
  const { subtitle, title, checked, onClick } = props;

  return (
    <ListItem
      onClick={onClick}
      title={title}
      subtitle={subtitle}
      after={
        <>
          <Radio readOnly checked={checked} />
        </>
      }
    />
  );
}
