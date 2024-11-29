import os
import torch
from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
import librosa  # For loading audio files
import whisper  # Whisper for transcription

# Load the pre-trained Whisper model from the saved file
saved_model_path = os.path.join(settings.BASE_DIR, "saved_models", "whisper_model.pth")
model = torch.load(saved_model_path)

model.eval()  # Set model to evaluation mode

def transcribe_audio(request):
    if request.method == 'POST':
        if 'audio' not in request.FILES:
            return JsonResponse({"error": "No audio file found"}, status=400)

        audio_file = request.FILES['audio']
        try:
            print(f"Received audio file: {audio_file.name}, size: {audio_file.size}")
            
            # Load the audio file using librosa and resample to 16kHz
            audio, sr = librosa.load(audio_file, sr=16000)
            print(f"Audio loaded, sample rate: {sr}, audio length: {len(audio)} samples")
            
            # Use your model to transcribe the audio
            result = model.transcribe(audio)  # Ensure you have the model defined
            transcription = result['text']
            print(f"Transcription result: {transcription}")
            
            return JsonResponse({"transcription": transcription})

        except Exception as e:
            print(f"Error processing audio: {e}")  # Log the error
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
def speech_to_text(request):
    # Render the HTML page for uploading audio
    return render(request, 'sstt.html')  # Make sure 'sstt.html' is in the templates folder
