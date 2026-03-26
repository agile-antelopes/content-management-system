export interface Country {
    id: string;
    name: string;
    language: string;
    population: string;
    governmentType: string;
    currency: string;
    location: string;
    geographicCharacteristics: string;
    climate: string;
    transport: string;
    briefHistory: string;
    mainCities: string;
    religion: string;
    values: string;
    traditionsAndCustoms: string;
    typicalFood: string;
    greetings: string;
    commonPhrasesOrSlang: string;
}

export interface Question {
    id: string;
    topic: string;
    text: string;
}

export interface TestimonialResponse {
    questionId: string;
    answer: string;
}

export interface TestimonialData {
    fullName: string;
    age: string;
    email: string;
    countryOfBirth: string;
    travelCountry: string;
    responses: TestimonialResponse[];
}

// Initial Mock Data
const countries: Country[] = [
    {
        id: '1',
        name: 'Mexico',
        language: 'Spanish',
        population: '128M',
        governmentType: 'Republic',
        currency: 'Peso',
        location: 'North America',
        geographicCharacteristics: '',
        climate: '',
        transport: '',
        briefHistory: '',
        mainCities: '',
        religion: '',
        values: '',
        traditionsAndCustoms: '',
        typicalFood: 'Tacos',
        greetings: '',
        commonPhrasesOrSlang: ''
    },
    {
        id: '2',
        name: 'Japan',
        language: 'Japanese',
        population: '125M',
        governmentType: 'Constitutional Monarchy',
        currency: 'Yen',
        location: 'Asia',
        geographicCharacteristics: '',
        climate: '',
        transport: '',
        briefHistory: '',
        mainCities: '',
        religion: '',
        values: '',
        traditionsAndCustoms: '',
        typicalFood: 'Sushi',
        greetings: '',
        commonPhrasesOrSlang: ''
    }
];

const questions: Question[] = [
    {id: '1', topic: 'Culture', text: 'What surprised you the most?'},
    {id: '2', topic: 'Food', text: 'What was your favorite dish?'}
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    getCountries: async (): Promise<Country[]> => {
        await delay(300);
        return [...countries];
    },
    addCountry: async (countryData: Omit<Country, 'id'>): Promise<Country> => {
        await delay(300);
        const newCountry = {id: String(Date.now()), ...countryData};
        countries.push(newCountry);
        return newCountry;
    },
    getQuestions: async (): Promise<Question[]> => {
        await delay(300);
        return [...questions];
    },
    addQuestion: async (questionData: Omit<Question, 'id'>): Promise<Question> => {
        await delay(300);
        const newQuestion = {id: String(Date.now()), ...questionData};
        questions.push(newQuestion);
        return newQuestion;
    },
    submitTestimonial: async (data: TestimonialData): Promise<{ success: boolean }> => {
        await delay(500);
        console.log("Testimonial saved:", data);
        return {success: true};
    }
};