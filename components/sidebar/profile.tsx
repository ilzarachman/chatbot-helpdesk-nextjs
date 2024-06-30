import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Profile({ profileName }: { profileName: string }) {
    return (
        <div className="w-full mb-2">
            <div className="p-3">
                <div className="flex gap-2 justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <Avatar className="size-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className="font-normal text-sm">{profileName}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="translate-x-3">
                        <LogOut className="w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
