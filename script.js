document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    var infoIcon = document.querySelector('.info-icon');
    var modal = document.querySelector('.modal');
    var modalContent = document.querySelector('.modal-content');
    var closeButton = document.querySelector('.close-button');
    var closeButton = document.querySelector('.close-button');
    var userInput = document.getElementById('userInput');
    var avatarImage = document.getElementById('avatarImage');
    var searchButton = document.getElementById('searchButton');
    var spinner = document.getElementsByClassName('spinner')[0];
    var skinCheckTrue = document.getElementById('skinCheckTrue');
    var skinCheckFalse = document.getElementById('skinCheckFalse');
    var makeupCheckTrue = document.getElementById('makeupCheckTrue');
    var makeupCheckFalse = document.getElementById('makeupCheckFalse');

    // Regex
    var skinPattern = /hd-\d+-(10\b|1\b|1370\b|19\b|20\b|1371\b|30\b|1372\b|1373\b|1375\b|1379\b|1385\b|1386\b|1387\b|5\b|1389\b|4\b|1359\b|3\b|1390\b|1391\b|11\b|2\b|7\b|28\b)/;
    var accessoriesPattern = /fa-/;

    // Def
    avatarImage.src = "https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=mitojmcam&direction=4&head_direction=2&size=l&action=std";

    // Eventos
    infoIcon.addEventListener('click', function() {
        modal.style.display = "block"; 
        modalContent.style.display = "block"; 
        requestAnimationFrame(() => {
            modal.classList.add('show');
            modalContent.classList.add('show');
        });
    });

    closeButton.addEventListener('click', function() {
        modal.classList.remove('show');
        modalContent.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
            modalContent.style.display = "none";
        }, 400); 
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.classList.remove('show');
            modalContent.classList.remove('show');
            setTimeout(() => {
                modal.style.display = "none";
                modalContent.style.display = "none";
            }, 400); 
        }
    });

    searchButton.addEventListener('click', updateAvatar);
    userInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter' && userInput.value.trim() !== '') {
            updateAvatar();
        }
    });

    function showModal() {
        modal.style.display = "block";
    }

    function hideModal() {
        modal.style.display = "none";
    }

    function updateAvatar() {
        var username = userInput.value.trim() || 'default';
        var apiURL = `https://www.habbo.com.br/api/public/users?name=${encodeURIComponent(username)}`;
        spinner.hidden = false;
        avatarImage.style.display = 'none';
        fetch(apiURL)
            .then(response => response.json())
            .then(data => {
                var figureString = data.figureString;
                var imageUrl = `https://sandbox.habbo.com/habbo-imaging/avatarimage?figure=${figureString}&gender=M&size=l&direction=2&head_direction=3`;
                avatarImage.src = imageUrl;
                avatarImage.onload = () => {
                    spinner.hidden = true;
                    avatarImage.style.display = 'block'; 
                    updateChecks(figureString);
                }
            })
            .catch(error => {
                console.error('Erro ao receber os dados:', error);
                spinner.hidden = true;
                showError("Erro ao receber os dados. Por favor, tente novamente.");
            });
    }

    function updateChecks(figureString) {
        skinCheckTrue.style.display = skinPattern.test(figureString) ? 'inline' : 'none';
        skinCheckFalse.style.display = skinPattern.test(figureString) ? 'none' : 'inline';
        makeupCheckTrue.style.display = accessoriesPattern.test(figureString) ? 'none' : 'inline';
        makeupCheckFalse.style.display = accessoriesPattern.test(figureString) ? 'inline' : 'none';
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.className = 'error-message';
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }
});
