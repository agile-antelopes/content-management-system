import {useForm} from '@tanstack/react-form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../api/mockApi';

const COUNTRY_FACT_FIELDS = [
    'language', 'population', 'governmentType', 'currency', 'location',
    'climate', 'typicalFood', 'greetings' // Acortado por brevedad, añade los que falten
];

const inputClass = "mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2.5 outline-none";

export default function CountryForm() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: api.addCountry,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['countries']});
            alert('Country inserted into DB!');
        }
    });

    const form = useForm({
        defaultValues: {
            country_code: '',
            country_name: '',
            ...COUNTRY_FACT_FIELDS.reduce((acc, field) => ({...acc, [field]: ''}), {})
        } as Record<string, string>,

        onSubmit: async ({value, formApi}) => {
            // Separar columnas reales de la BD del JSON de "facts"
            const {country_code, country_name, ...details} = value;
            mutation.mutate({country_code, country_name, details});
            formApi.reset();
        },
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
        }}>
            <h3 className="text-lg font-semibold mb-6 border-b pb-2">Database Table: country</h3>

            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-indigo-50 rounded border border-indigo-100">
                <form.Field name="country_code">
                    {(field) => (
                        <div>
                            <label className="block text-sm font-bold text-indigo-900">Country Code (CHAR 3)</label>
                            <input value={field.state.value}
                                   onChange={(e) => field.handleChange(e.target.value.substring(0, 3).toUpperCase())}
                                   className={inputClass} placeholder="MEX" maxLength={3}/>
                        </div>
                    )}
                </form.Field>

                <form.Field name="country_name">
                    {(field) => (
                        <div>
                            <label className="block text-sm font-bold text-indigo-900">Country Name (VARCHAR)</label>
                            <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                   className={inputClass} placeholder="Mexico"/>
                        </div>
                    )}
                </form.Field>
            </div>

            <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Facts (Saved as JSON
                Text)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {COUNTRY_FACT_FIELDS.map((fieldName) => (
                    <form.Field key={fieldName} name={fieldName}>
                        {(field) => (
                            <div>
                                <label
                                    className="block text-sm font-medium text-slate-700 capitalize">{fieldName.replace(/([A-Z])/g, ' $1').trim()}</label>
                                <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                       className={inputClass}/>
                            </div>
                        )}
                    </form.Field>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button type="submit" disabled={mutation.isPending}
                        className="bg-indigo-600 py-2 px-6 text-sm text-white rounded hover:bg-indigo-500">
                    Save Country
                </button>
            </div>
        </form>
    );
}