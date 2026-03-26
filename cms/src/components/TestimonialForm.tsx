import {useForm} from '@tanstack/react-form';
import {useQuery, useMutation} from '@tanstack/react-query';
import {api, type InterviewPayload} from '../api/mockApi';

const inputClass = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5 outline-none";

export default function TestimonialForm() {
    const {data: countries = []} = useQuery({queryKey: ['countries'], queryFn: api.getCountries});
    const {data: topics = []} = useQuery({queryKey: ['topics'], queryFn: api.getTopics});
    const {data: questions = []} = useQuery({queryKey: ['questions'], queryFn: api.getQuestions});

    const mutation = useMutation({
        mutationFn: api.submitInterview,
        onSuccess: () => alert('Interview saved to database successfully!')
    });

    const form = useForm({
        defaultValues: {
            interviewer_name: '',
            interviewee_name: '',
            country_id: '',
            responses: []
        } as InterviewPayload,
        onSubmit: async ({value, formApi}) => {
            mutation.mutate(value);
            formApi.reset();
        },
    });

    // Helper para obtener el nombre del topic
    const getTopicName = (id: number) => topics.find(t => t.topic_tag_id === id)?.topic_tag || 'General';

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
        }} className="space-y-8">

            {/* Contributor / Interview Information */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b">Interview Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <form.Field name="interviewer_name">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Interviewer Name</label>
                                <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                       className={inputClass}/>
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="interviewee_name">
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Interviewee Name</label>
                                <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                       className={inputClass}/>
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="country_id">
                        {(field) => (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700">Country Discussed</label>
                                <select value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                        className={`${inputClass} bg-white`}>
                                    <option value="" disabled>Select a country...</option>
                                    {countries.map(c => <option key={c.country_code}
                                                                value={c.country_code}>[{c.country_code}] {c.country_name}</option>)}
                                </select>
                            </div>
                        )}
                    </form.Field>
                </div>
            </div>

            {/* Responses */}
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b">Responses</h3>
                {questions.length === 0 ? (
                    <p className="text-sm text-slate-500">No questions available.</p>
                ) : (
                    <div className="space-y-6">
                        {questions.map((q, index) => (
                            <div key={q.id} className="bg-slate-50 border rounded-lg p-5">
                                <p className="text-sm font-medium text-slate-900 mb-3">
                  <span className="inline-flex rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-700 mr-2">
                    {getTopicName(q.topic_tag_id)}
                  </span>
                                    {q.question_text}
                                </p>

                                {/* Hidden fields para guardar la metadata necesaria para la BD */}
                                <form.Field name={`responses[${index}].topic_tag_id`} defaultValue={q.topic_tag_id}>
                                    {(field) => <input type="hidden" value={field.state.value}/>}
                                </form.Field>
                                <form.Field name={`responses[${index}].question`} defaultValue={q.question_text}>
                                    {(field) => <input type="hidden" value={field.state.value}/>}
                                </form.Field>

                                <form.Field name={`responses[${index}].answer`} defaultValue="">
                                    {(field) => (
                                        <textarea
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className={`${inputClass} min-h-[80px]`}
                                            placeholder="Answer..."
                                        />
                                    )}
                                </form.Field>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4 flex justify-end">
                <button type="submit" disabled={mutation.isPending}
                        className="bg-indigo-600 py-2 px-6 text-sm text-white rounded hover:bg-indigo-500">
                    {mutation.isPending ? 'Saving...' : 'Save Interview'}
                </button>
            </div>
        </form>
    );
}