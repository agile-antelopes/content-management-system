import {useForm} from '@tanstack/react-form';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {api, type TopicDB, type QuestionDB} from '../api/mockApi.ts';

export default function QuestionForm() {
    const queryClient = useQueryClient();
    const {data: topics = []} = useQuery<TopicDB[]>({queryKey: ['topics'], queryFn: api.getTopics});
    const {data: questions = []} = useQuery<QuestionDB[]>({queryKey: ['questions'], queryFn: api.getQuestions});

    const mutation = useMutation({
        mutationFn: api.addQuestion,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['questions']})
    });

    const form = useForm({
        defaultValues: {topic_tag_id: '', question_text: ''},
        onSubmit: async ({value, formApi}) => {
            mutation.mutate({topic_tag_id: Number(value.topic_tag_id), question_text: value.question_text});
            formApi.reset();
        }
    });

    return (
        <div className="space-y-8">
            <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }} className="bg-slate-50 p-4 rounded border">
                <h3 className="font-bold mb-4">Add Question Template</h3>
                <div className="flex flex-col gap-4">
                    <form.Field name="topic_tag_id">{(f) => (
                        <select className="border p-2 rounded" value={f.state.value}
                                onChange={e => f.handleChange(e.target.value)}>
                            <option value="">Select Category...</option>
                            {topics.map(t => <option key={t.topic_tag_id}
                                                     value={t.topic_tag_id}>{t.topic_tag}</option>)}
                        </select>
                    )}</form.Field>
                    <form.Field name="question_text">{(f) => (
                        <textarea className="border p-2 rounded" placeholder="Question text..." value={f.state.value}
                                  onChange={e => f.handleChange(e.target.value)}/>
                    )}</form.Field>
                    <button type="submit" className="bg-indigo-600 text-white p-2 rounded font-bold">Save Template
                    </button>
                </div>
            </form>

            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="bg-slate-100 text-left">
                    <th className="p-2 border">Topic</th>
                    <th className="p-2 border">Question</th>
                </tr>
                </thead>
                <tbody>
                {questions.map(q => (
                    <tr key={q.id} className="hover:bg-slate-50">
                        <td className="p-2 border font-medium text-indigo-700">{topics.find(t => t.topic_tag_id === q.topic_tag_id)?.topic_tag}</td>
                        <td className="p-2 border">{q.question_text}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}