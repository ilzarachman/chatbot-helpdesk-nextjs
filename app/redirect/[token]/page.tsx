"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function Redirect({ params }: { params: { token: string } }) {
  const { token } = params;
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const opener = window.opener as Window;

    if (token == "none") {
      opener.postMessage(
        { status: "none", error: searchParams.get("error_msg"), desc: searchParams.get("desc") },
        "*"
      );
      window.close();
      return;
    }

    if (opener) {
      opener.postMessage({ status: "success" }, "*");
    }

    window.close();
  }, []);

  return (
    <div className="w-svw h-svh absolute top-0 left-0 bg-background z-50">
      Authenticated! closing...
    </div>
  );
}
