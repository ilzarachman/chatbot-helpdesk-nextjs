import HistoryItem, {HistoryItemAnimated} from "@/components/sidebar/history-item";
import { ChatContext } from "@/lib/context-provider";
import { useContext } from "react";

type Conversation = {
    uuid: string;
    name: string;
    start_time: string;
}

export default function History({ histories, updateHistory }: { histories: Conversation[], updateHistory: () => Promise<void> }) {

    const { newConvHistory } = useContext(ChatContext);

    return (
        <div className="h-full w-full">
            {newConvHistory.value.title !== "" ? (
                <HistoryItemAnimated text={newConvHistory.value.title} uuid={newConvHistory.value.uuid} updateHistory={updateHistory} />
            ): ("")}

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
