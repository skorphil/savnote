import styles from "./BottomAppBar.module.css";
import type { ReactElement } from "react";

type BottomAppBarProps = {
  leftButtons?: ReactElement[];
  fab?: ReactElement;
  bg?: string;
};

/**
 * @prop props.leftButtons - Array of buttons (max 4)
 * @prop props.bg - tailwing class for background
 * Add safety padding (80px) to scroll component to prevent AppBar
 * content overlaying
 *
 * @link https://m3.material.io/components/bottom-app-bar/specs
 */
export function BottomAppBar(props: BottomAppBarProps) {
  const { leftButtons, fab, bg } = props;
  return (
    <div className={`${styles.appBar} ${bg}`}>
      <div className="flex flex-row gap-0">
        {leftButtons?.map((button, id) => (
          <div key={`bottom-bar-${id}`}>{button}</div>
        ))}
      </div>
      {fab}
    </div>
  );
}
