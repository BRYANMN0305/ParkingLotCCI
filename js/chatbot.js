const toggleChatBot = () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    chatbotContainer.classList.toggle('open');
}

const responses = {
    '¿Para que sirve este sitio web?': 'Nuestro sitio web funciona para manejar el ingreso y salida de nuestros queridos empleados de manera eficiente y segura',
    'Tengo dudas ¿Como puedo contactarlos?': 'Claro! Puedes contactarnos mediante nuestro formulario de contacto (click arriba de nuestro chatbot). LLena todos los campos y no dudes en preguntar lo que te intriga, haremos lo posible por resolver tu duda lo antes posible',
    '¿El sitio web solo sirve para dicha empresa?': 'Sí, ofrecemos un servicio estricta y unicamente para "cci ingenierias". Gracias por preguntar',
    
};

const sendMessage = () => {
    const userInput = document.getElementById('user-input').value;
    const messages = document.getElementById('messages');

    if (userInput.trim() !== '') {
        const userMessage = document.createElement('div');
        userMessage.innerHTML = `<strong>Tú:</strong> ${userInput}`;
        messages.appendChild(userMessage);

        document.getElementById('user-input').value = '';
        document.getElementById('question-suggestions').style.display = 'none';

        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.innerHTML = responses[userInput] ? `<strong>Asistente:</strong> ${responses[userInput]}` : `<strong>Asistente:</strong> Lo siento, no tengo una respuesta para esa pregunta.`;
            messages.appendChild(botMessage);
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    }
}

const selectSuggestion = (suggestion) => {
    document.getElementById('user-input').value = suggestion;
    document.getElementById('question-suggestions').style.display = 'none';
}

const showSuggestions = () => {
    document.getElementById('question-suggestions').style.display = 'block';
}