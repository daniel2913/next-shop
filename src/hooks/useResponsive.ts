import { ResponsiveContext } from "@/providers/ResponsiveProvider";
import React from "react";
export default function useResponsive() {
	return React.useContext(ResponsiveContext).mode as "desktop" | "mobile";
}
