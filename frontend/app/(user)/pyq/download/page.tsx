// "use client";

import ClientPyqdownload from "./PyqdownloadClient";

export const metadata = {
  title: "BEU Download PYQs - AlphaResult",
  description:
    "Download previous year question papers for BEU engineering students by subject and semester.",
};

export default function PYQDOWNLOADRoot() {
  return <ClientPyqdownload />;
}