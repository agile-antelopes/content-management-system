import {useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import TestimonialForm from './components/TestimonialForm';
import CountryForm from './components/CountryForm';
import QuestionForm from './components/QuestionForm';

const queryClient = new QueryClient();

export default function App() {
    const [activeTab, setActiveTab] = useState<number>(1);

    const tabs = [
        {id: 1, label: '1. Testimonials'},
        {id: 2, label: '2. Countries'},
        {id: 3, label: '3. Questions'},
    ];

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
                <div
                    className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-200 bg-white">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Experience Collection
                            System</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage testimonials, countries, and survey
                            questions.</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-200 bg-slate-50/50 px-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-6 text-sm font-medium transition-colors duration-200 border-b-2 mb-[-1px] ${
                                    activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600 bg-white'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 1 && <TestimonialForm/>}
                        {activeTab === 2 && <CountryForm/>}
                        {activeTab === 3 && <QuestionForm/>}
                    </div>

                </div>
            </div>
        </QueryClientProvider>
    );
}