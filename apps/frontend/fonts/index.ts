import { Inter, Outfit, Sen, Space_Grotesk } from "next/font/google";
import local from "next/font/local";

export const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const spaceGrotest = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const outfit = Outfit({
  weight: ["400", "500", "600", "700", "100", "200", "300", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const sen = Sen({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "800"],
});

export const satoshi = local({
  src: "../public/fonts/Satoshi-Variable.ttf",
  display: "swap",
});
