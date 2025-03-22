import { App as KonstaApp, KonstaProvider } from "konsta/react";
import type { ReactElement } from "react";

type KonstaUIProviderProps = {
  children: ReactElement;
};
export function KonstaUIProvider(props: KonstaUIProviderProps) {
  return (
    <KonstaProvider theme="material" dark={true}>
      <KonstaApp theme="material" className="k-material">
        {props.children}
      </KonstaApp>
    </KonstaProvider>
  );
}
