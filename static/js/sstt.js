document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const transcriptionText = document.getElementById('transcriptionText');

    // Check if the browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert('Sorry, your browser does not support speech recognition.');
        startBtn.disabled = true;
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Set recognition settings
    recognition.continuous = false; // Stops after recognizing
    recognition.interimResults = false; // Only final results
    recognition.lang = 'en-US'; // Set the language

    recognition.onstart = function() {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        transcriptionText.value = "Listening...";
    };

    recognition.onresult = function(event) {
        let finalTranscript = '';

        // Iterate over the event results and transcribe
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            }
        }

        // Display transcribed text
        transcriptionText.value = finalTranscript;
    };

    recognition.onerror = function(event) {
        switch (event.error) {
            case 'no-speech':
                transcriptionText.value = "No speech detected. Please try again.";
                break;
            case 'audio-capture':
                transcriptionText.value = "No microphone found. Please check your microphone.";
                break;
            case 'not-allowed':
                transcriptionText.value = "Permission to use microphone is denied.";
                break;
            case 'service-not-allowed':
                transcriptionText.value = "Speech recognition service is not allowed.";
                break;
            default:
                transcriptionText.value = `Error occurred in recognition: ${event.error}`;
        }
    };

    recognition.onend = function() {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        transcriptionText.value += " (Recognition ended)";
    };

    // Start speech recognition
    startBtn.addEventListener('click', () => {
        recognition.start();
    });

    // Stop speech recognition
    stopBtn.addEventListener('click', () => {
        recognition.stop();
    });
});

// Handle audio file submission
document.getElementById("audioForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    fetch("{% url 'transcribe_audio' %}", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const transcriptionText = document.getElementById("transcriptionText");
        if (data.transcription) {
            transcriptionText.value = data.transcription;
        } else {
            transcriptionText.value = "Error: " + data.error;
        }
    })
    .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
        document.getElementById("transcriptionText").value = "Error: " + error.message;
    });
});