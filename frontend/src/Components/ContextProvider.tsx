import { memo, ReactNode, StrictMode } from "react";

interface IContextProviderProps {
	children: ReactNode;
}

export default memo(function ContextProvider ({ children }: IContextProviderProps) {
	return (
		<StrictMode>
			{ children }
		</StrictMode>
	);
});
