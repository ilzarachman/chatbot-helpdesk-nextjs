import HistoryItem from "@/components/sidebar/history-item";

export default function History({ histories }: { histories: string[] }) {
    return (
        <div className="h-full w-full">
            {histories.map((text, i) => (
                <HistoryItem key={i} text={text} />
            ))}
        </div>
    );
}
