import { recordsStore } from "@/entities/journal";
import type { ReactElement } from "react";
import { Provider } from "tinybase/ui-react";
import { Inspector } from "tinybase/ui-react-inspector";

type AppProps = {
  children: ReactElement;
};
export function TinyBaseProvider(props: AppProps) {
  return (
    <Provider store={recordsStore}>
      {props.children}
      <Inspector />
    </Provider>
  );
}
