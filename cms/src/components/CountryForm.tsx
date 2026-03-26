import {useForm} from '@tanstack/react-form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../api/mockApi.ts';

const FACT_FIELDS = ['language', 'population', 'government', 'currency', 'climate', 'food', 'traditions'];

export default function CountryForm() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: api.addCountry,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['countries']});
            alert('Country added!');
        }
    });

    const form = useForm({
        defaultValues: {
            country_code: '', country_name: '', ...FACT_FIELDS.reduce((a, v) => ({
                ...a,
                [v]: ''
            }), {})
        } as any,
        onSubmit: async ({value, formApi}) => {
            const {country_code, country_name, ...details} = value;
            mutation.mutate({country_code, country_name, details});
            formApi.reset();
        }
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
        }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-indigo-50 p-4 rounded border border-indigo-200">
                <form.Field name="country_code">{(f) => (
                    <div><label className="text-xs font-bold uppercase text-indigo-800">Code (3 chars)</label>
                        <input className="w-full border p-2 rounded" maxLength={3} value={f.state.value}
                               onChange={e => f.handleChange(e.target.value.toUpperCase())}/></div>
                )}</form.Field>
                <form.Field name="country_name">{(f) => (
                    <div><label className="text-xs font-bold uppercase text-indigo-800">Name</label>
                        <input className="w-full border p-2 rounded" value={f.state.value}
                               onChange={e => f.handleChange(e.target.value)}/></div>
                )}</form.Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FACT_FIELDS.map(field => (
                    <form.Field key={field} name={field}>{(f) => (
                        <div><label className="text-xs font-bold capitalize text-slate-600">{field}</label>
                            <input className="w-full border p-2 rounded" value={f.state.value}
                                   onChange={e => f.handleChange(e.target.value)}/></div>
                    )}</form.Field>
                ))}
            </div>

            <button type="submit" className="w-full bg-slate-800 text-white p-2 rounded font-bold hover:bg-slate-900">
                {mutation.isPending ? 'Saving...' : 'Register Country'}
            </button>
        </form>
    );
}