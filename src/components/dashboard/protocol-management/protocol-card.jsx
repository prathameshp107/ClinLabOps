import { Badge } from "@/components/ui/badge"
import { PencilLine, Eye, CopyPlus, ArchiveRestore, Trash, FlaskConical } from "lucide-react"

export function ProtocolCard({ protocol, onView, onEdit, onDuplicate, onArchive, onDelete }) {
    // Status color mapping
    const statusColor =
        protocol.status === "Approved"
            ? "border-green-400"
            : protocol.status === "Draft"
                ? "border-yellow-400"
                : protocol.status === "In Review"
                    ? "border-blue-400"
                    : "border-gray-300"

    const badgeColor =
        protocol.status === "Approved"
            ? "bg-green-100 text-green-700 border-green-200"
            : protocol.status === "Draft"
                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                : protocol.status === "In Review"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"

    return (
        <div
            className={`relative flex flex-col bg-gradient-to-br from-white/80 via-blue-50/60 to-slate-100/80 dark:from-card/90 dark:via-slate-900/80 dark:to-card/80 rounded-2xl shadow-2xl hover:shadow-3xl transition-all border-l-8 ${statusColor} border border-border/20 p-6 h-full backdrop-blur-md hover:scale-[1.03] duration-200 group overflow-hidden`}
            style={{ minHeight: 260 }}
        >
            {/* Faint background illustration/icon */}
            <FlaskConical className="absolute right-4 bottom-4 w-20 h-20 text-primary/10 opacity-30 pointer-events-none select-none z-0" />
            <div className="flex items-center justify-between mb-3 z-10 relative">
                <h3 className="font-extrabold text-xl truncate text-foreground/90 group-hover:text-primary transition-colors duration-200">
                    {protocol.title}
                </h3>
                <Badge className={`px-3 py-1 rounded-full border text-xs font-semibold shadow-sm ${badgeColor}`}>{protocol.status}</Badge>
            </div>
            <div className="text-xs text-muted-foreground mb-2 font-mono tracking-tight z-10 relative">{protocol.id}</div>
            <div className="mb-5 space-y-1 z-10 relative">
                <div className="text-sm flex items-center gap-1">
                    <span className="font-medium text-foreground/80">Category:</span> {protocol.category}
                </div>
                <div className="text-sm flex items-center gap-1">
                    <span className="font-medium text-foreground/80">Author:</span> {protocol.author}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>Updated:</span> {new Date(protocol.updatedAt || protocol.updated_at).toLocaleDateString()}
                </div>
            </div>
            {/* Divider */}
            <div className="border-t border-border/20 my-2 z-10 relative" />
            <div className="mt-auto flex gap-2 justify-end z-10 relative">
                <button
                    onClick={() => onView(protocol)}
                    className="p-2 rounded-full hover:bg-primary/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    title="View Details"
                >
                    <Eye className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onEdit(protocol)}
                    className="p-2 rounded-full hover:bg-primary/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    title="Edit Protocol"
                >
                    <PencilLine className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onDuplicate(protocol)}
                    className="p-2 rounded-full hover:bg-primary/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    title="Duplicate Protocol"
                >
                    <CopyPlus className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onArchive(protocol.id)}
                    className="p-2 rounded-full hover:bg-primary/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    title="Archive Protocol"
                >
                    <ArchiveRestore className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onDelete(protocol.id)}
                    className="p-2 rounded-full hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-200"
                    title="Delete Protocol"
                >
                    <Trash className="h-5 w-5 text-red-500" />
                </button>
            </div>
        </div>
    )
}
