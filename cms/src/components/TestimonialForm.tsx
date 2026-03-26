import {useForm} from '@tanstack/react-form';
import {useQuery, useMutation} from '@tanstack/react-query';
import {api, type TestimonialData} from '../api/mockApi';

const inputClass = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5 outline-none transition-shadow";
const labelClass = "block text-sm font-medium text-slate-700 capitalize";

export default function TestimonialForm() {
    const {data: countries = []} = useQuery({queryKey: ['countries'], queryFn: api.getCountries});
    const {data: questions = []} = useQuery({queryKey: ['questions'], queryFn: api.getQuestions});

    const mutation = useMutation({
        mutationFn: api.submitTestimonial,
        onSuccess: () => alert('Testimonial submitted successfully!')
    });

    const form = useForm({
        defaultValues: {
            fullName: '',
            age: '',
            email: '',
            countryOfBirth: '',
            travelCountry: '',
            responses: []
        } as TestimonialData, // <-- El tipo va aquí
        onSubmit: async ({value, formApi}) => {
            mutation.mutate(value);
            formApi.reset();
        },
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
        }} className="space-y-8">

            {/* Contributor Information */}
            <div>
                <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4 pb-2 border-b border-slate-100">Contributor
                    Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(['fullName', 'age', 'email'] as const).map(fieldName => (
                        <form.Field key={fieldName} name={fieldName}>
                            {(field) => (
                                <div>
                                    <label className={labelClass}>{fieldName.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    <input
                                        value={field.state.value as string}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        type={fieldName === 'age' ? 'number' : fieldName === 'email' ? 'email' : 'text'}
                                        className={inputClass}
                                        placeholder={`Enter ${fieldName.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                                    />
                                </div>
                            )}
                        </form.Field>
                    ))}

                    {(['countryOfBirth', 'travelCountry'] as const).map(fieldName => (
                        <form.Field key={fieldName} name={fieldName}>
                            {(field) => (
                                <div>
                                    <label className={labelClass}>
                                        {fieldName === 'countryOfBirth' ? 'Country of Birth' : 'Travel Country'}
                                    </label>
                                    <select value={field.state.value as string}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className={`${inputClass} bg-white`}>
                                        <option value="" disabled>Select a country...</option>
                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </form.Field>
                    ))}
                </div>
            </div>

            {/* Testimonial Responses */}
            <div>
                <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4 pb-2 border-b border-slate-100">Testimonial
                    Responses</h3>
                {questions.length === 0 ? (
                    <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-md border border-slate-200">No
                        questions available. Please add some in the Questions tab.</p>
                ) : (
                    <div className="space-y-6">
                        {questions.map((q, index) => (
                            <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                                <p className="text-sm font-medium text-slate-900 mb-3">
                  <span
                      className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mr-2">
                    {q.topic}
                  </span>
                                    {q.text}
                                </p>

                                <form.Field name={`responses[${index}].questionId`} defaultValue={q.id}>
                                    {(field) => <input type="hidden" value={field.state.value as string}/>}
                                </form.Field>

                                <form.Field name={`responses[${index}].answer`} defaultValue="">
                                    {(field) => (
                                        <textarea
                                            value={field.state.value as string}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className={`${inputClass} min-h-[80px]`}
                                            placeholder="Write your answer here..."
                                        />
                                    )}
                                </form.Field>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {mutation.isPending ? 'Submitting...' : 'Submit Testimonial'}
                </button>
            </div>
        </form>
    );
}