window.onload = function () {
    const fileInput = document.getElementById('note-image');
    const textInput = document.getElementById('note-prompt');
    const generateButton = document.getElementById('generate-button');
    const generatedNotesSection = document.getElementById('generated-notes');
    let storedImages = [];
    let promptText = '';

    textInput.addEventListener('input', function () {
        promptText = this.value;
    });

    fileInput.addEventListener('change', function () {
        const files = this.files;
        storedImages = [];

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    storedImages.push(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                console.warn("File not supported:", file.name);
            }
        });
    });

    generateButton.addEventListener('click', async function (event) {
        event.preventDefault(); 

        if (storedImages.length === 0 && !promptText) {
            alert("Please add some text or images before generating notes.");
            return;
        }

        try {
            generateButton.disabled = true;
            generatedNotesSection.innerHTML = '<p>Generating notes...</p>';

            const formData = new FormData();
            formData.append('prompt', escapeLatex(promptText) + 
                ' Generate LaTeX notes based on this prompt and/or the provided images. ' +
                'Return only the LaTeX code without the document class, preamble, and document environment. ' +
                'Start  with the content, using only the necessary LaTeX commands for formatting.' +
                'Do not include \\begin{document} or \\end{document}.');
            storedImages.forEach((img, index) => {
                formData.append(`image${index}`, img);
            });

            const response = await fetch('http://localhost:3000/process-input', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            const generator = new latexjs.HtmlGenerator({ hyphenate: false });
            const parsed = latexjs.parse(data.response, { generator: generator });
            const latexHTML = generator.domFragment().firstElementChild.outerHTML;
            const latexContainer = document.createElement('div');
            latexContainer.className = 'latex-content';
            latexContainer.innerHTML = latexHTML;
            generatedNotesSection.innerHTML = `
            <h2>Generated LaTeX Notes</h2>
            <div class="note"><pre>${data.response}</pre></div>
        `;
            generatedNotesSection.appendChild(latexContainer);

        } catch (error) {
            console.error('Failed to generate notes:', error);
            generatedNotesSection.innerHTML = `
                <p>Failed to generate notes: ${error.message}</p>
            `;
        } finally {
            generateButton.disabled = false;
        }
    });
    function escapeLatex(text) {
        return text.replace(/([#%&_\${}])/g, '\\$1');
    }
};
