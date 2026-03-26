import { useForm } from '@tanstack/react-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table';
import { api, type QuestionTemplate } from '../api/mockApi';
import { useMemo } from 'react';

const inputClass = "mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2.5 outline-none focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-shadow";

export default function QuestionForm() {
    const queryClient = useQueryClient();

    // Obtenemos tanto las preguntas como los temas (topics)
    const { data: questions = [] } = useQuery({ queryKey: ['questions'], queryFn: api.getQuestions });
    const { data: topics = [] } = useQuery({ queryKey: ['topics'], queryFn: api.getTopics });

    const mutation = useMutation({
        mutationFn: api.addQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        }
    });

    const form = useForm({
        // Usamos string temporalmente para el select, luego lo convertimos a número en el submit
        defaultValues: { topic_tag_id: '', question_text: '' } as { topic_tag_id: string | number, question_text: string },
        onSubmit: async ({ value, formApi }) => {
            mutation.mutate({
                topic_tag_id: Number(value.topic_tag_id),
                question_text: value.question_text
            });
            formApi.reset();
        },
    });

    // Configuración de las columnas de TanStack Table
    const columns = useMemo<ColumnDef<QuestionTemplate>[]>(
        () => [
            {
                accessorKey: 'topic_tag_id',
                header: 'Category (Topic)',
                // Formateamos la celda para mostrar el nombre del Topic en lugar del ID numérico
                cell: (info) => {
                    const topicId = info.getValue() as number;
                    const topicName = topics.find(t => t.topic_tag_id === topicId)?.topic_tag || 'Unknown';
                    return (
                        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {topicName}
            </span>
                    );
                }
            },
            { accessorKey: 'question_text', header: 'Question' },
        ],
        [topics] // Dependencia importante: si los topics cargan, la tabla se re-renderiza con los nombres correctos
    );

    const table = useReactTable({
        data: questions,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-10">
                <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4">Add Question Template</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <form.Field name="topic_tag_id">
                            {(field) => (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Category (Topic)</label>
                                    <select
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={`${inputClass} bg-white`}
                                    >
                                        <option value="" disabled>Select a topic...</option>
                                        {topics.map(t => (
                                            <option key={t.topic_tag_id} value={t.topic_tag_id}>
                                                {t.topic_tag}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div className="md:col-span-2">
                        <form.Field name="question_text">
                            {(field) => (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Question</label>
                                    <input
                                        value={field.state.value as string}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        className={inputClass}
                                        placeholder="E.g.: What was your favorite meal?"
                                    />
                                </div>
                            )}
                        </form.Field>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="inline-flex justify-center rounded-md bg-slate-800 py-2 px-6 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 disabled:opacity-50 transition-all"
                    >
                        {mutation.isPending ? 'Saving...' : 'Add Question'}
                    </button>
                </div>
            </form>

            {/* Renderizado de la Tabla */}
            <div>
                <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4">Question Templates</h3>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-300">
                        <thead className="bg-slate-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-500 sm:pl-6">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}