// Variáveis para os elementos do Cadastro  
const cadastroForm = document.querySelector('.cadastro-overlay form');
const cadastroOverlay = document.querySelector('.cadastro-overlay');

// Variáveis para os elementos dos Modais (serão definidas após o carregamento)  
let loginModalOverlay, userInput, passwordInput, loginButton, backToRegisterBtn;
let forgotPasswordLink, forgotPasswordModal, forgotEmailInput, sendResetLinkBtn, backToLoginBtnForgot;
let resetPasswordModal, newPasswordInput, confirmNewPasswordInput, resetPasswordBtn, backToForgotBtn;
let successModal, closeSuccessModalBtn;

function carregarVisitaCSS() {
    // Verifica se o CSS já foi carregado para evitar duplicatas
    if (document.querySelector('link[href="../css/visita.css"]')) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../css/visita.css'; // Ajuste o caminho conforme necessário
    document.head.appendChild(link);
}

// Função para carregar e injetar os modais do visita.html  
function carregarModaisDoVisita() {
    const requisicao = new XMLHttpRequest();
    requisicao.open("GET", "../HTML/visita.html", true);
    requisicao.onreadystatechange = function () {
        if (requisicao.readyState === 4) {
            if (requisicao.status === 200) {
                // Carrega o CSS do visita.html
                carregarVisitaCSS();
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(requisicao.responseText, 'text/html');

                // Extrair os elementos dos modais do HTML carregado
                let modaisHtml = `
                    ${htmlDoc.querySelector('#login-modal-overlay')?.outerHTML || ''}
                    ${htmlDoc.querySelector('#forgot-password-modal')?.outerHTML || ''}
                    ${htmlDoc.querySelector('#reset-password-modal')?.outerHTML || ''}
                    ${htmlDoc.querySelector('#success-modal')?.outerHTML || ''}
                `;

                if (modaisHtml.trim()) {
                    // Remover o botao " fazer cadastro "
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = modaisHtml;

                    // Encontrar o container do modal de login dentro do tempDiv
                    const loginModalContainer = tempDiv.querySelector('#login-modal-overlay .modal-container');
                    if (loginModalContainer) {
                        // Encontrar o botão "Fazer Cadastro" (id="register-button") dentro do container do modal de login
                        const registerButton = loginModalContainer.querySelector('#register-button');
                        if (registerButton) {
                            // Remover o botão
                            registerButton.remove();
                            console.log("Botão 'Fazer Cadastro' removido do modal de login injetado.");
                        }
                    }

                    modaisHtml = tempDiv.innerHTML;

                    // Injetar no body (ou no contêiner específico)  
                    document.body.insertAdjacentHTML('beforeend', modaisHtml);

                    // Agora, obter as referências dos elementos injetados
                    loginModalOverlay = document.getElementById('login-modal-overlay');
                    userInput = document.getElementById('user');
                    passwordInput = document.getElementById('password');
                    loginButton = document.getElementById('login-button');
                    backToRegisterBtn = document.getElementById('back-to-register-btn'); // Este ID NÃO EXISTE no visita.html original!

                    forgotPasswordLink = document.getElementById('forgot-password-link');
                    forgotPasswordModal = document.getElementById('forgot-password-modal');
                    forgotEmailInput = document.getElementById('forgot-email');
                    sendResetLinkBtn = document.getElementById('send-reset-link-btn');
                    backToLoginBtnForgot = document.getElementById('back-to-login-btn'); // Atenção: ID diferente no visita.html

                    resetPasswordModal = document.getElementById('reset-password-modal');
                    newPasswordInput = document.getElementById('new-password');
                    confirmNewPasswordInput = document.getElementById('confirm-new-password');
                    resetPasswordBtn = document.getElementById('reset-password-btn');
                    backToForgotBtn = document.getElementById('back-to-forgot-btn');

                    successModal = document.getElementById('success-modal');
                    closeSuccessModalBtn = document.getElementById('close-success-modal-btn');

                    const backToLoginBtnOriginal = document.getElementById('back-to-login-btn');
                    if (backToLoginBtnOriginal) {
                         backToLoginBtnOriginal.addEventListener('click', closeLoginModal);
                    }

                    // Inicializar os eventos dos modais
                    inicializarEventosDosModais();
                } else {
                     console.error("Nenhum modal encontrado em visita.html ou caminho incorreto.");
                }
            } else {
                console.error("Erro ao carregar visita.html via AJAX:", requisicao.status, requisicao.statusText);
                console.log("Verifique se está rodando localmente com um servidor (ex: Live Server).");
            }
        }
    };
    requisicao.send();
}

// Funções para Abrir/Fechar Modais (adaptadas para o contexto do cadastro)  
function openLoginModal() {
    if (!loginModalOverlay) {
        console.error("Modais não carregados ainda.");
        return;
    }
    // Fecha outros modais de senha que possam estar abertos
    if(forgotPasswordModal) forgotPasswordModal.style.display = 'none';
    if(resetPasswordModal) resetPasswordModal.style.display = 'none';
    if(successModal) successModal.style.display = 'none';
    // Abre o modal de login
    loginModalOverlay.style.display = 'flex';
    // Limpa campos de login
    if(userInput) userInput.value = '';
    if(passwordInput) passwordInput.value = '';
}

function closeLoginModal() {
    if(loginModalOverlay) loginModalOverlay.style.display = 'none';
}

function openForgotPasswordModal() {
    if(loginModalOverlay) loginModalOverlay.style.display = 'none';
    if(forgotPasswordModal) {
        forgotPasswordModal.style.display = 'flex';
        if(forgotEmailInput) forgotEmailInput.value = '';
    }
}   

function closeForgotPasswordModal() {
    if(forgotPasswordModal) forgotPasswordModal.style.display = 'none';
    openLoginModal();
}

function openResetPasswordModal() {
    if(forgotPasswordModal) forgotPasswordModal.style.display = 'none';
    if(resetPasswordModal) {
        resetPasswordModal.style.display = 'flex';
        if(newPasswordInput) newPasswordInput.value = '';
        if(confirmNewPasswordInput) confirmNewPasswordInput.value = '';
    }
}

function closeResetPasswordModal() {
    if(resetPasswordModal) resetPasswordModal.style.display = 'none';
    openForgotPasswordModal();
}

function openSuccessModal() {
    if(resetPasswordModal) resetPasswordModal.style.display = 'none';
    if(successModal) successModal.style.display = 'flex';
}

function closeSuccessModal() {
    if(successModal) successModal.style.display = 'none';
    openLoginModal();
}

// Funções de Eventos dos Modais  
function inicializarEventosDosModais() {
    if (!loginModalOverlay || !forgotPasswordLink) return; // Verifica se os elementos existem

    // Event Listeners  
    // Botão para fechar o modal de login ao clicar fora
    loginModalOverlay.addEventListener('click', (event) => {
        if (event.target === loginModalOverlay) {
            closeLoginModal();
        }
    });

    // Link "Esqueci a senha" no modal de login
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        openForgotPasswordModal();
    });

    // Botão "Enviar Link" no modal de esqueci a senha
    if(sendResetLinkBtn) {
        sendResetLinkBtn.addEventListener('click', () => {
            const email = forgotEmailInput?.value.trim() || '';
            if (!email) {
                alert('Por favor, digite seu e-mail.');
                return;
            }
            console.log('Simulando envio de e-mail para:', email);
            alert(`E-mail de redefinição enviado para ${email}.`);
            openResetPasswordModal();
        });
    }

    // Botão "Voltar ao Login" no modal de esqueci a senha (já adaptado acima)
    if(backToLoginBtnForgot) { // Este ID é diferente no visita.html!
        backToLoginBtnForgot.addEventListener('click', closeForgotPasswordModal);
    }

    // Botão "Redefinir Senha" no modal de redefinir senha
    if(resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', () => {
            const newPassword = newPasswordInput?.value || '';
            const confirmNewPassword = confirmNewPasswordInput?.value || '';

            if (!newPassword || !confirmNewPassword) {
                alert('Por favor, preencha ambos os campos de senha.');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alert('As senhas não coincidem.');
                return;
            }

            if (newPassword.length < 6) {
                alert('A nova senha deve ter pelo menos 6 caracteres.');
                return;
            }

            console.log('Simulando redefinição de senha para:', newPassword);
            openSuccessModal();
        });
    }

    // Botão "Voltar" no modal de redefinir senha
    if(backToForgotBtn) {
        backToForgotBtn.addEventListener('click', closeResetPasswordModal);
    }

    // Botão "Fechar" no modal de sucesso
    if(closeSuccessModalBtn) {
        closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
    }

    // Botão "Fechar" no modal de sucesso ao clicar fora
    if(successModal) {
        successModal.addEventListener('click', (event) => {
            if (event.target === successModal) {
                closeSuccessModal();
            }
        });
    }

    // Botão "Redefinir Senha" no modal de redefinir senha ao clicar fora
    if(resetPasswordModal) {
        resetPasswordModal.addEventListener('click', (event) => {
            if (event.target === resetPasswordModal) {
                closeResetPasswordModal();
            }
        });
    }

    // Botão "Recuperar Senha" no modal de esqueci a senha ao clicar fora
    if(forgotPasswordModal) {
        forgotPasswordModal.addEventListener('click', (event) => {
            if (event.target === forgotPasswordModal) {
                closeForgotPasswordModal();
            }
        });
    }

    // Simulação de Login  
    if(loginButton) {
        loginButton.addEventListener('click', () => {
            const usuario = userInput?.value.trim() || '';
            const password = passwordInput?.value.trim() || '';

            if (!usuario || !password) {
                alert('Por favor, preencha o nome de usuário e a senha.');
                return;
            }

            const usuariosValidos = [
                { username: 'admin', password: 'admin123' },
                { username: 'user1', password: 'senha123' }
            ];

            const usuarioValido = usuariosValidos.find(u => u.username === usuario && u.password === password);

            if (usuarioValido) {
                console.log('Login bem-sucedido para o usuário:', usuario);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', usuario);
                if(loginModalOverlay) loginModalOverlay.style.display = 'none';
                if(userInput) userInput.value = '';
                if(passwordInput) passwordInput.value = '';
                window.location.href = 'entrada.html';
            } else {
                alert('Usuário ou senha incorretos.');
                if(passwordInput) {
                     passwordInput.value = '';
                     passwordInput.focus();
                }
            }
        });
    }
}

// Event Listeners para acionar os modais a partir do cadastro  
document.addEventListener('DOMContentLoaded', () => {
    // Carregar os modais do visita.html
    carregarModaisDoVisita();

    // Botão "Já tem uma conta? Entrar"
    const openLoginFromRegisterLink = document.getElementById('open-login-from-register');
    if(openLoginFromRegisterLink) {
        openLoginFromRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            openLoginModal();
        });
    }

    // Botão "Esqueceu a senha?"
    const openForgotFromRegisterLink = document.getElementById('open-forgot-from-register');
    if(openForgotFromRegisterLink) {
        openForgotFromRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            openLoginModal(); // Primeiro abre o login
            setTimeout(openForgotPasswordModal, 10); // Depois abre o de esqueceu (com pequeno delay para garantir renderização)
        });
    }
});

// Event Listener para o Formulário de Cadastro (exemplo)  
// cadastroForm?.addEventListener('submit', (e) => {
//     e.preventDefault();
//     alert('Cadastro enviado! (Simulação)');
// });
