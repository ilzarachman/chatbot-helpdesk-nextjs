import React from "react";
import { MessageSquareText, LogOut } from "lucide-react";
import { SquareChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function Header({ fnCloseSidebar }: { fnCloseSidebar: () => void }) {
    return (
        <>
            <div className="flex items-center space-x-2">
                <MessageSquareText className="w-4" />
                <h1>Helpdesk</h1>
            </div>
            <Button variant="ghost" size="icon" className="translate-x-3" onClick={fnCloseSidebar}>
                <SquareChevronLeft className="w-4" />
            </Button>
        </>
    );
}

export default Header;
