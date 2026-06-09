"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ─────────────────────────────────────────── */
interface Column {
    name: string;
    type: string;
    constraints: string;
}

interface Table {
    name: string;
    columns: Column[];
}

interface SchemaEditorProps {
    schemaSql: string;
    isDark: boolean;
    onApply: (editedSql: string, instruction: string) => void;
    onClose: () => void;
}

const PG_TYPES = [
    "UUID", "TEXT", "INTEGER", "BIGINT", "BIGSERIAL", "BOOLEAN",
    "TIMESTAMPTZ", "TIMESTAMP", "DATE", "NUMERIC", "JSONB",
    "SMALLINT", "REAL", "DOUBLE PRECISION", "VARCHAR(255)", "BYTEA",
];

const COMMON_CONSTRAINTS = [
    "PRIMARY KEY", "NOT NULL", "UNIQUE", "DEFAULT NOW()",
    "DEFAULT gen_random_uuid()", "DEFAULT true", "DEFAULT false",
    "DEFAULT 0", "REFERENCES", "CHECK",
];

/* ── Parse SQL DDL into structured tables ─────────── */
function parseSqlToTables(sql: string): Table[] {
    const tables: Table[] = [];
    // Note: No global flag (g) to avoid stateful regex issues with lastIndex
    const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(([\s\S]*?)\);/i;

    // Find all table definitions
    let remainingSql = sql;
    while (remainingSql.length > 0) {
        const match = tableRegex.exec(remainingSql);
        if (!match) break;

        const tableName = match[1];
        const body = match[2];

        // Slice remaining SQL to continue searching
        remainingSql = remainingSql.slice(match.index + match[0].length);

        // Split by commas but respect parentheses
        const lines: string[] = [];
        let depth = 0;
        let current = "";
        for (const ch of body) {
            if (ch === "(") depth++;
            if (ch === ")") depth--;
            if (ch === "," && depth === 0) {
                lines.push(current.trim());
                current = "";
            } else {
                current += ch;
            }
        }
        if (current.trim()) lines.push(current.trim());

        const columns: Column[] = [];
        for (const line of lines) {
            const trimmed = line.trim();
            // Skip constraints lines (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, INDEX)
            if (/^(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK|CONSTRAINT|INDEX|CREATE\s+INDEX)/i.test(trimmed)) continue;
            if (!trimmed || trimmed.startsWith("--")) continue;

            // Parse: column_name TYPE [constraints...]
            const parts = trimmed.match(/^(\w+)\s+(\w[\w()., ]*?)(\s+(?:PRIMARY|NOT|UNIQUE|DEFAULT|REFERENCES|CHECK|GENERATED|CONSTRAINT).*)?\s*$/i);
            if (parts) {
                columns.push({
                    name: parts[1],
                    type: parts[2].trim().toUpperCase(),
                    constraints: (parts[3] || "").trim(),
                });
            }
        }

        if (columns.length > 0) {
            tables.push({ name: tableName, columns });
        }
    }

    return tables;
}

/* ── Convert tables back to SQL ───────────────────── */
function tablesToSql(tables: Table[]): string {
    return tables.map((t) => {
        const cols = t.columns.map((c) =>
            `  ${c.name} ${c.type}${c.constraints ? " " + c.constraints : ""}`
        ).join(",\n");
        return `CREATE TABLE ${t.name} (\n${cols}\n);`;
    }).join("\n\n");
}

/* ── Build a human-readable instruction of changes ── */
function buildChangeInstruction(original: Table[], edited: Table[]): string {
    const instructions: string[] = [];

    // New tables
    for (const t of edited) {
        if (!original.find((o) => o.name === t.name)) {
            instructions.push(`Added new table "${t.name}" with columns: ${t.columns.map(c => c.name).join(", ")}`);
        }
    }
    // Deleted tables
    for (const t of original) {
        if (!edited.find((e) => e.name === t.name)) {
            instructions.push(`Removed table "${t.name}"`);
        }
    }
    // Modified tables
    for (const t of edited) {
        const orig = original.find((o) => o.name === t.name);
        if (!orig) continue;
        for (const col of t.columns) {
            if (!orig.columns.find((c) => c.name === col.name)) {
                instructions.push(`Added column "${col.name}" (${col.type}) to table "${t.name}"`);
            }
        }
        for (const col of orig.columns) {
            if (!t.columns.find((c) => c.name === col.name)) {
                instructions.push(`Removed column "${col.name}" from table "${t.name}"`);
            }
        }
    }

    return instructions.length > 0
        ? `User made these changes to the schema:\n${instructions.join("\n")}\n\nRegenerate the full schema incorporating these changes. Keep all existing tables/columns not mentioned.`
        : "User confirmed the schema without changes.";
}

/* ═══════════════════════════════════════════════════════
   SCHEMA EDITOR COMPONENT
   ═══════════════════════════════════════════════════════ */
export function SchemaEditor({ schemaSql, isDark, onApply, onClose }: SchemaEditorProps) {
    const [tables, setTables] = useState<Table[]>(() => parseSqlToTables(schemaSql));
    const originalTables = useState<Table[]>(() => parseSqlToTables(schemaSql))[0];
    const [expandedTable, setExpandedTable] = useState<string | null>(tables[0]?.name ?? null);
    const [editingCell, setEditingCell] = useState<{ table: string; col: number; field: "name" | "type" | "constraints" } | null>(null);

    const updateColumn = useCallback((tableName: string, colIdx: number, field: keyof Column, value: string) => {
        setTables((prev) => prev.map((t) =>
            t.name === tableName
                ? { ...t, columns: t.columns.map((c, i) => i === colIdx ? { ...c, [field]: value } : c) }
                : t
        ));
    }, []);

    const addColumn = useCallback((tableName: string) => {
        setTables((prev) => prev.map((t) =>
            t.name === tableName
                ? { ...t, columns: [...t.columns, { name: "new_column", type: "TEXT", constraints: "NOT NULL" }] }
                : t
        ));
    }, []);

    const removeColumn = useCallback((tableName: string, colIdx: number) => {
        setTables((prev) => prev.map((t) =>
            t.name === tableName
                ? { ...t, columns: t.columns.filter((_, i) => i !== colIdx) }
                : t
        ));
    }, []);

    const addTable = useCallback(() => {
        const name = `new_table_${Date.now().toString(36)}`;
        setTables((prev) => [...prev, {
            name,
            columns: [
                { name: "id", type: "UUID", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()" },
                { name: "created_at", type: "TIMESTAMPTZ", constraints: "NOT NULL DEFAULT NOW()" },
            ],
        }]);
        setExpandedTable(name);
    }, []);

    const removeTable = useCallback((tableName: string) => {
        setTables((prev) => prev.filter((t) => t.name !== tableName));
        if (expandedTable === tableName) setExpandedTable(null);
    }, [expandedTable]);

    const renameTable = useCallback((oldName: string, newName: string) => {
        setTables((prev) => prev.map((t) => t.name === oldName ? { ...t, name: newName } : t));
        if (expandedTable === oldName) setExpandedTable(newName);
    }, [expandedTable]);

    const handleApply = () => {
        const sql = tablesToSql(tables);
        const instruction = buildChangeInstruction(originalTables, tables);
        onApply(sql, instruction);
    };

    return (
        <div className={cn(
            "rounded-2xl border shadow-2xl overflow-hidden",
            isDark ? "border-white/10 bg-zinc-900/95 backdrop-blur-xl" : "border-zinc-200 bg-white"
        )}>
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between border-b px-5 py-3",
                isDark ? "border-white/[0.06] bg-zinc-800/50" : "border-zinc-100 bg-zinc-50"
            )}>
                <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </div>
                    <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-zinc-900")}>
                        Schema Editor
                    </span>
                    <span className={cn("text-xs", isDark ? "text-zinc-500" : "text-zinc-400")}>
                        {tables.length} table{tables.length !== 1 ? "s" : ""}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={addTable}
                        className={cn(
                            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                            isDark
                                ? "bg-white/[0.06] text-zinc-300 hover:bg-white/10"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        )}
                    >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Table
                    </button>
                    <button
                        onClick={onClose}
                        className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                            isDark ? "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                        )}
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Table list */}
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
                <AnimatePresence mode="popLayout">
                    {tables.map((table) => (
                        <motion.div
                            key={table.name}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "rounded-xl border overflow-hidden transition-colors",
                                isDark ? "border-white/[0.06]" : "border-zinc-200",
                                expandedTable === table.name && (isDark ? "border-zinc-500/30" : "border-zinc-300")
                            )}
                        >
                            {/* Table header — must be a div, not button, because it contains the delete button */}
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpandedTable(expandedTable === table.name ? null : table.name); }}
                                className={cn(
                                    "flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left transition-colors",
                                    isDark ? "bg-white/[0.02] hover:bg-white/[0.04]" : "bg-zinc-50 hover:bg-zinc-100"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className={cn("h-4 w-4 transition-transform", expandedTable === table.name && "rotate-90", isDark ? "text-zinc-500" : "text-zinc-400")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                    {editingCell?.table === table.name && editingCell.field === "name" && editingCell.col === -1 ? (
                                        <input
                                            autoFocus
                                            className={cn("rounded px-2 py-0.5 text-sm font-semibold outline-none ring-1 ring-zinc-500/50", isDark ? "bg-zinc-800 text-white" : "bg-white text-zinc-900")}
                                            defaultValue={table.name}
                                            onBlur={(e) => { renameTable(table.name, e.target.value || table.name); setEditingCell(null); }}
                                            onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span
                                            className={cn("text-sm font-semibold cursor-text", isDark ? "text-white" : "text-zinc-900")}
                                            onDoubleClick={(e) => { e.stopPropagation(); setEditingCell({ table: table.name, col: -1, field: "name" }); }}
                                        >
                                            {table.name}
                                        </span>
                                    )}
                                    <span className={cn("text-[11px]", isDark ? "text-zinc-600" : "text-zinc-400")}>
                                        {table.columns.length} col{table.columns.length !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeTable(table.name); }}
                                    className={cn("flex h-6 w-6 items-center justify-center rounded-md transition-colors opacity-0 group-hover:opacity-100", isDark ? "text-red-400/40 hover:bg-red-500/10 hover:text-red-400" : "text-red-300 hover:bg-red-50 hover:text-red-500")}
                                    style={{ opacity: 1 }}
                                    title="Remove table"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>

                            {/* Columns */}
                            <AnimatePresence>
                                {expandedTable === table.name && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className={cn("border-t", isDark ? "border-white/[0.04]" : "border-zinc-100")}>
                                            {/* Column headers */}
                                            <div className={cn("grid grid-cols-[1fr_120px_1fr_32px] gap-2 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider", isDark ? "text-zinc-600" : "text-zinc-400")}>
                                                <span>Name</span>
                                                <span>Type</span>
                                                <span>Constraints</span>
                                                <span></span>
                                            </div>

                                            {/* Column rows */}
                                            {table.columns.map((col, i) => (
                                                <div
                                                    key={`${table.name}-${i}`}
                                                    className={cn(
                                                        "grid grid-cols-[1fr_120px_1fr_32px] gap-2 px-4 py-1.5 text-xs transition-colors",
                                                        isDark ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50",
                                                        i % 2 === 0 && (isDark ? "bg-white/[0.01]" : "bg-zinc-50/50")
                                                    )}
                                                >
                                                    {/* Name */}
                                                    <input
                                                        className={cn("rounded px-2 py-1 font-medium outline-none transition-all focus:ring-1 focus:ring-zinc-500/50", isDark ? "bg-transparent text-zinc-200 focus:bg-zinc-800" : "bg-transparent text-zinc-800 focus:bg-white")}
                                                        value={col.name}
                                                        onChange={(e) => updateColumn(table.name, i, "name", e.target.value)}
                                                    />
                                                    {/* Type */}
                                                    <select
                                                        className={cn("rounded px-1.5 py-1 outline-none transition-all cursor-pointer focus:ring-1 focus:ring-zinc-500/50", isDark ? "bg-transparent text-zinc-300 focus:bg-zinc-800" : "bg-transparent text-zinc-600 focus:bg-white")}
                                                        value={PG_TYPES.includes(col.type) ? col.type : ""}
                                                        onChange={(e) => updateColumn(table.name, i, "type", e.target.value)}
                                                    >
                                                        {!PG_TYPES.includes(col.type) && <option value="">{col.type}</option>}
                                                        {PG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                    {/* Constraints */}
                                                    <input
                                                        className={cn("rounded px-2 py-1 outline-none transition-all focus:ring-1 focus:ring-zinc-500/50", isDark ? "bg-transparent text-zinc-400 focus:bg-zinc-800" : "bg-transparent text-zinc-500 focus:bg-white")}
                                                        value={col.constraints}
                                                        onChange={(e) => updateColumn(table.name, i, "constraints", e.target.value)}
                                                        placeholder="constraints..."
                                                    />
                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => removeColumn(table.name, i)}
                                                        className={cn("flex h-6 w-6 items-center justify-center rounded transition-colors self-center", isDark ? "text-zinc-600 hover:bg-red-500/10 hover:text-red-400" : "text-zinc-300 hover:bg-red-50 hover:text-red-500")}
                                                    >
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add column button */}
                                            <button
                                                onClick={() => addColumn(table.name)}
                                                className={cn(
                                                    "flex w-full items-center justify-center gap-1.5 py-2 text-[11px] font-medium transition-colors",
                                                    isDark ? "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-400" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                                                )}
                                            >
                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                Add Column
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className={cn(
                "flex items-center justify-between border-t px-5 py-3",
                isDark ? "border-white/[0.06] bg-zinc-800/30" : "border-zinc-100 bg-zinc-50/80"
            )}>
                <span className={cn("text-[11px]", isDark ? "text-zinc-600" : "text-zinc-400")}>
                    Double-click table name to rename • Edit columns inline
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className={cn(
                            "rounded-lg px-4 py-2 text-xs font-medium transition-all",
                            isDark ? "text-zinc-400 hover:bg-white/[0.06]" : "text-zinc-500 hover:bg-zinc-100"
                        )}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-zinc-500 to-zinc-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        Apply & Regenerate
                    </button>
                </div>
            </div>
        </div>
    );
}
