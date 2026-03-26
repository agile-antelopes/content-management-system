// 1. Interfaces exactas de la Base de Datos
export interface CountryDB {
    country_code: string; // char(3) PK
    country_name: string;
    facts: string; // text (Aquí guardaremos el JSON con clima, comida, etc.)
}

export interface TopicTagDB {
    topic_tag_id: number; // integer PK
    topic_tag: string; // varchar
}

// 2. Interfaces para el Frontend (Plantillas de Preguntas)
export interface QuestionTemplate {
    id: string; // Solo para uso interno del frontend
    topic_tag_id: number;
    question_text: string;
}

// 3. Payload para el envío del Testimonio (Interview + Responses)
export interface ResponsePayload {
    topic_tag_id: number;
    question: string;
    answer: string;
}

export interface InterviewPayload {
    interviewer_name: string;
    interviewee_name: string;
    country_id: string; // FK a country_code
    responses: ResponsePayload[];
}

// ---- DATOS INICIALES SIMULADOS ----
let countries: CountryDB[] = [
    { country_code: 'MEX', country_name: 'Mexico', facts: '{"typicalFood":"Tacos","language":"Spanish"}' },
    { country_code: 'JPN', country_name: 'Japan', facts: '{"typicalFood":"Sushi","language":"Japanese"}' }
];

let topics: TopicTagDB[] = [
    { topic_tag_id: 1, topic_tag: 'Culture' },
    { topic_tag_id: 2, topic_tag: 'Food' }
];

let questionTemplates: QuestionTemplate[] = [
    { id: 'q1', topic_tag_id: 1, question_text: 'What surprised you the most about the culture?' },
    { id: 'q2', topic_tag_id: 2, question_text: 'What was your favorite local dish?' }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    getCountries: async (): Promise<CountryDB[]> => {
        await delay(300);
        return [...countries];
    },

    // Recibe los datos del formulario, los convierte a JSON y los guarda
    addCountry: async (data: { country_code: string, country_name: string, details: Record<string, string> }): Promise<CountryDB> => {
        await delay(300);
        const newCountry: CountryDB = {
            country_code: data.country_code.toUpperCase(),
            country_name: data.country_name,
            facts: JSON.stringify(data.details) // Empaquetamos en la columna 'facts'
        };
        countries.push(newCountry);
        return newCountry;
    },

    getTopics: async (): Promise<TopicTagDB[]> => {
        await delay(200);
        return [...topics];
    },

    getQuestions: async (): Promise<QuestionTemplate[]> => {
        await delay(300);
        return [...questionTemplates];
    },

    addQuestion: async (data: Omit<QuestionTemplate, 'id'>): Promise<QuestionTemplate> => {
        await delay(300);
        const newQ = { id: String(Date.now()), ...data };
        questionTemplates.push(newQ);
        return newQ;
    },

    submitInterview: async (data: InterviewPayload): Promise<{ success: boolean }> => {
        await delay(500);
        // Aquí tu backend real insertaría en 'interview-A' y luego iteraría sobre 'responses'
        // para insertar en 'response-A' usando el interview_id generado.
        console.log("PAYLOAD LISTO PARA LA BD:", JSON.stringify(data, null, 2));
        return { success: true };
    }
};