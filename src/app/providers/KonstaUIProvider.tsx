import { App as KonstaApp, KonstaProvider } from "konsta/react";
import type { ReactElement } from "react";

type KonstaUIProviderProps = {
	children: ReactElement;
};
export function KonstaUIProvider(props: KonstaUIProviderProps) {
	return (
		<KonstaProvider theme="material" dark={true}>
			<KonstaApp
				touchRipple={false}
				theme="material"
				className="k-material overflow-hidden" // overflow-hidden prevents shaking effect when scroll reached an end
			>
				{props.children}
			</KonstaApp>
		</KonstaProvider>
	);
}
