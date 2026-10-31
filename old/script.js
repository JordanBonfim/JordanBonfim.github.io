
document.addEventListener('DOMContentLoaded', () => {
    const mediaDisplayImage = document.getElementById('mediaDisplayImage');
    const mediaDisplayVideo = document.getElementById('mediaDisplayVideo');
    const mediaTitle = document.getElementById('mediaTitle');
    const mediaExplanation = document.getElementById('mediaExplanation');
    const mediaCopyright = document.getElementById('mediaCopyright');
    const newMediaBtn = document.getElementById('newMediaBtn');

    // **SUA CHAVE DA API DA NASA AQUI**
    // Obtenha uma chave gratuita em: https://api.nasa.gov/
    const NASA_API_KEY = "cIChgXVbWnZPPFOLzPR3H4kTMzaO0Ur3p4TcSBs9"


    // Função auxiliar para gerar uma data aleatória entre duas datas
    function getRandomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    // Função para buscar a Imagem Astronômica do Dia da NASA
    async function fetchAPODMedia() {
        // Desabilitar o botão enquanto o conteúdo está sendo carregado
        newMediaBtn.disabled = true;
        newMediaBtn.textContent = 'Carregando...';

        // Esconder ambos os elementos de mídia e limpar os textos
        mediaDisplayImage.style.display = 'none';
        mediaDisplayVideo.style.display = 'none';
        mediaDisplayImage.src = ''; // Limpa o src da imagem
        mediaDisplayVideo.src = ''; // Limpa o src do vídeo
        mediaTitle.textContent = '';
        mediaExplanation.textContent = '';
        mediaCopyright.textContent = '';

        try {
            // Gerar uma data aleatória para obter imagens/vídeos diferentes
            const startDate = new Date('1995-06-16'); // APOD começou em 16 de junho de 1995
            const endDate = new Date(); // Data atual
            const randomDate = getRandomDate(startDate, endDate);
            const formattedDate = randomDate.toISOString().slice(0, 10); // Formato YYYY-MM-DD

            const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${formattedDate}`;

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            // Exibir título, explicação e copyright
            mediaTitle.textContent = data.title || 'Título Indisponível';
            mediaExplanation.textContent = data.explanation || 'Explicação Indisponível.';
            mediaCopyright.textContent = data.copyright ? `Créditos: ${data.copyright}` : '';

            if (data.media_type === 'image') {
                mediaDisplayImage.src = data.url;
                mediaDisplayImage.alt = data.title;
                mediaDisplayImage.style.display = 'block'; // Mostrar a imagem
            } else if (data.media_type === 'video') {
                // Para vídeos do YouTube, a API APOD geralmente fornece uma URL "embed"
                // ou uma URL normal que precisa ser convertida para embed.
                // O `url` geralmente é o link direto, e `hdurl` pode ser usado se disponível para vídeos também.
                // Vamos tentar usar o `url` e garantir que seja um link embeddable para o iframe.
                let videoSrc = data.url;

                // Pequena lógica para converter links do YouTube normais para embed
                if (videoSrc.includes('youtube.com/watch?v=')) {
                    videoSrc = videoSrc.replace('watch?v=', 'embed/');
                } else if (videoSrc.includes('youtu.be/')) {
                    videoSrc = videoSrc.replace('youtu.be/', 'youtube.com/embed/');
                }

                // Adiciona parâmetros para autoplay e esconder controles, se desejar
                // videoSrc += "?autoplay=1&controls=0";

                mediaDisplayVideo.src = videoSrc;
                mediaDisplayVideo.style.display = 'block'; // Mostrar o vídeo
            } else {
                // Caso não seja imagem nem vídeo
                mediaDisplayImage.src = 'https://via.placeholder.com/600x400?text=Tipo+de+Mídia+Não+Suportado';
                mediaDisplayImage.alt = 'Tipo de mídia não suportado';
                mediaDisplayImage.style.display = 'block';
                console.warn('Tipo de mídia não suportado:', data.media_type);
            }

        } catch (error) {
            console.error('Erro ao buscar a Imagem/Vídeo Astronômico do Dia:', error);
            mediaDisplayImage.src = 'https://via.placeholder.com/600x400?text=Erro+ao+Carregar+APOD';
            mediaDisplayImage.alt = 'Erro ao carregar o conteúdo APOD';
            mediaDisplayImage.style.display = 'block';
            mediaTitle.textContent = 'Erro ao Carregar Conteúdo';
            mediaExplanation.textContent = 'Não foi possível carregar o conteúdo APOD. Verifique sua chave da API ou tente novamente mais tarde.';
            mediaCopyright.textContent = '';
            alert('Não foi possível carregar o conteúdo APOD. Verifique sua chave da API ou tente novamente mais tarde.');
        } finally {
            // Reabilitar o botão e restaurar o texto
            newMediaBtn.disabled = false;
            newMediaBtn.textContent = 'Ver Nova APOD';
        }
    }

    // Carrega um conteúdo APOD ao carregar a página pela primeira vez
    fetchAPODMedia();

    // Adiciona o evento de clique ao botão
    newMediaBtn.addEventListener('click', fetchAPODMedia);
});
