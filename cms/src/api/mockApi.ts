const API_URL = 'https://backend-two-psi-89.vercel.app';

export interface CountryDB {
    country_code: string;
    country_name: string;
    facts: string;
}

export interface TopicDB {
    topic_tag_id: number;
    topic_tag: string;
}

export interface QuestionDB {
    id: number;
    topic_tag_id: number;
    question_text: string;
}

export const api = {
    // GETs
    getCountries: () => fetch(`${API_URL}/countries`).then(res => res.json()),
    getTopics: () => fetch(`${API_URL}/topics`).then(res => res.json()),
    getQuestions: () => fetch(`${API_URL}/questions`).then(res => res.json()),

    // POSTs
    addCountry: (data: any) => fetch(`${API_URL}/countries`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => res.json()),

    addQuestion: (data: any) => fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => res.json()),

    submitInterview: (data: any) => fetch(`${API_URL}/interviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => res.json()),
};