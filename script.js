const codeEditor = document.getElementById('code-editor');
const languageSelect = document.getElementById('language-select');
const outputConsole = document.getElementById('output-console');
const compileBtn = document.getElementById('compile-btn');

compileBtn.addEventListener('click', () => {
    const code = codeEditor.value.trim();
    const langId = languageSelect.value;

    if (!code) {
        outputConsole.textContent = 'Error: Code editor is empty.';
        return;
    }

    outputConsole.textContent = 'Compiling...';

    fetch('https://codequotient.com/api/executeCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, langId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            outputConsole.textContent = `Error: ${data.error}`;
        } else if (data.codeId) {
            checkResult(data.codeId);
        } else {
            outputConsole.textContent = 'Unexpected response. Please try again.';
        }
    })
    .catch(error => {
        outputConsole.textContent = `Error: ${error.message}`;
    });
});

function checkResult(codeId) {
    const intervalId = setInterval(() => {
        fetch(`https://codequotient.com/api/codeResult/${codeId}`)
            .then(response => response.json())
            .then(data => {
                const result = data?.data;
                if (result) {
                    clearInterval(intervalId);
                    if (result.output) {
                        outputConsole.textContent = `Output:\n${result.output}`;
                    } else if (result.errors) {
                        outputConsole.textContent = `Error:\n${result.errors}`;
                    } else {
                        outputConsole.textContent = 'No output or error received.';
                    }
                }
            })
            .catch(error => {
                clearInterval(intervalId);
                outputConsole.textContent = `Error fetching result: ${error.message}`;
            });
    }, 1000);
}