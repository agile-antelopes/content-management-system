import {useForm} from '@tanstack/react-form';
import {useQuery, useMutation} from '@tanstack/react-query';
import {api, type CountryDB, type QuestionDB, type TopicDB} from '../api/mockApi';

export default function TestimonialForm() {
    const {data: countries = []} = useQuery<CountryDB[]>({queryKey: ['countries'], queryFn: api.getCountries});
    const {data: questions = []} = useQuery<QuestionDB[]>({queryKey: ['questions'], queryFn: api.getQuestions});
    const {data: topics = []} = useQuery<TopicDB[]>({queryKey: ['topics'], queryFn: api.getTopics});

    const mutation = useMutation({
        mutationFn: api.submitInterview,
        onSuccess: () => alert('Interview saved successfully!')
    });

    const form = useForm({
        defaultValues: {
            interviewer_name: '',
            interviewee_name: '',
            country_id: '',
            responses: [] as { topic_tag_id: number; question: string; answer: string }[]
        },
        onSubmit: async ({value, formApi}) => {
            mutation.mutate(value);
            formApi.reset();
        },
    });

    const getTopicName = (id: number) => topics.find(t => t.topic_tag_id === id)?.topic_tag || 'General';

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
        }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field name="interviewer_name">{(f) => (
                    <div><label className="text-sm font-bold">Interviewer</label>
                        <input className="w-full border p-2 rounded" value={f.state.value}
                               onChange={e => f.handleChange(e.target.value)}/></div>
                )}</form.Field>

                <form.Field name="interviewee_name">{(f) => (
                    <div><label className="text-sm font-bold">Interviewee</label>
                        <input className="w-full border p-2 rounded" value={f.state.value}
                               onChange={e => f.handleChange(e.target.value)}/></div>
                )}</form.Field>

                <form.Field name="country_id">{(f) => (
                    <div className="md:col-span-2"><label className="text-sm font-bold">Country</label>
                        <select className="w-full border p-2 rounded" value={f.state.value}
                                onChange={e => f.handleChange(e.target.value)}>
                            <option value="">Select...</option>
                            {countries.map(c => <option key={c.country_code}
                                                        value={c.country_code}>{c.country_name}</option>)}
                        </select></div>
                )}</form.Field>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold border-b pb-2">Questions</h3>
                {questions.map((q, i) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded shadow-sm border border-slate-200">
                        <p className="text-sm italic text-indigo-600 mb-2">{getTopicName(q.topic_tag_id)}</p>
                        <p className="font-medium mb-2">{q.question_text}</p>

                        <form.Field name={`responses[${i}].topic_tag_id`} defaultValue={q.topic_tag_id}>{(f) => <input
                            type="hidden" value={f.state.value}/>}</form.Field>
                        <form.Field name={`responses[${i}].question`} defaultValue={q.question_text}>{(f) => <input
                            type="hidden" value={f.state.value}/>}</form.Field>
                        <form.Field name={`responses[${i}].answer`} defaultValue="">{(f) => (
                            <textarea className="w-full border p-2 rounded" placeholder="Your answer..."
                                      value={f.state.value} onChange={e => f.handleChange(e.target.value)}/>
                        )}</form.Field>
                    </div>
                ))}
            </div>

            <button type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full font-bold">
                {mutation.isPending ? 'Saving...' : 'Submit Interview'}
            </button>
        </form>
    );
}