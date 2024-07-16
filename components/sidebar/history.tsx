import HistoryItem from "@/components/sidebar/history-item";

type Conversation = {
    uuid: string;
    name: string;
    start_time: string;
}

export default function History({ histories }: { histories: Conversation[] }) {
    return (
        <div className="h-full w-full">
            {histories.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center">
                    <p className="text-foreground">No history</p>
                </div>
            ) : ("")}
            {histories.map((conversation, i) => (
                <HistoryItem key={i} text={conversation.name} uuid={conversation.uuid} />
            ))}
        </div>
    );
}
