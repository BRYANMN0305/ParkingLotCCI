const toggleChatBot = () => {
    const chatbotContainer = document.getElementById('chatbot-container');
    chatbotContainer.classList.toggle('open');
}

const responses = {
    '¿Cuál es tu horario de atención?': 'Nuestro horario de atención es de lunes a viernes, de 9:00 AM a 6:00 PM.',
    '¿Quienes somos?': 'Somos una empresa constructora creada como alternativa para las necesidades de los sectores privados y públicos.',
    '¿Tienen algún servicio especial?': 'Sí, ofrecemos servicios personalizados para empresas. Como: Diseños Hidrosanitarios y Red Contra Incendio.',
    '¿Dónde están ubicados?': 'Estamos ubicados en la Calle 77 # 65 - 37. Ciudad: Barranquilla.'
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