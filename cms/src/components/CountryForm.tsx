import {useForm} from '@tanstack/react-form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api, type Country} from '../api/mockApi';

type CountryFormData = Omit<Country, 'id'>;

const COUNTRY_FIELDS: (keyof CountryFormData)[] = [
    'name', 'language', 'population', 'governmentType', 'currency',
    'location', 'geographicCharacteristics', 'climate', 'transport',
    'briefHistory', 'mainCities', 'religion', 'values',
    'traditionsAndCustoms', 'typicalFood', 'greetings', 'commonPhrasesOrSlang'
];

const inputClass = "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5 outline-none transition-shadow";

export default function CountryForm() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: api.addCountry,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['countries']}).then(r => console.log('Countries cache invalidated:', r));
            alert('Country added successfully!');
        }
    });

    const form = useForm({
        defaultValues: COUNTRY_FIELDS.reduce(
            (acc, field) => ({...acc, [field]: ''}),
            {} as CountryFormData
        ),
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
        }}>
            <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-6 pb-2 border-b border-slate-100">Add New
                Country</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                {COUNTRY_FIELDS.map((fieldName) => (
                    <form.Field key={fieldName} name={fieldName}>
                        {(field) => (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 capitalize">
                                    {fieldName.replace(/([A-Z])/g, ' $1').trim()}
                                </label>
                                <input
                                    value={field.state.value as string}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        )}
                    </form.Field>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all"
                >
                    {mutation.isPending ? 'Saving...' : 'Add Country'}
                </button>
            </div>
        </form>
    );
}